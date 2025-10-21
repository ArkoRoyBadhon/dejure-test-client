"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetLeaderboardQuery, useGenerateLeaderboardMutation, useGetTopPerformersQuery } from "@/redux/features/crm/leaderboard.api";
import { Loader2, Trophy, TrendingUp, Users, Award, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const LeaderBoardPage = () => {
  const [period, setPeriod] = useState("current");
  const [periodType, setPeriodType] = useState("monthly");
  
  // Get current date for default period
  const currentDate = new Date();
  const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  const { data: leaderboardData, isLoading, refetch } = useGetLeaderboardQuery({
    period: period === "current" ? currentPeriod : period,
    periodType,
  });
  
  const { data: topPerformersData } = useGetTopPerformersQuery({ limit: 5 });
  
  const [generateLeaderboard, { isLoading: isGenerating }] = useGenerateLeaderboardMutation();
  
  const handleGenerateLeaderboard = async () => {
    try {
      await generateLeaderboard({ period: currentPeriod }).unwrap();
      toast.success("Leaderboard generated successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to generate leaderboard");
    }
  };
  
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-700" />;
    return <span className="text-sm font-medium">#{rank}</span>;
  };
  
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Top Performer": return "bg-blue-100 text-blue-800";
      case "Fast Responder": return "bg-green-100 text-green-800";
      case "Conversion Expert": return "bg-purple-100 text-purple-800";
      case "Revenue Champion": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Representative Leaderboard</h1>
          <p className="text-gray-600">Track performance metrics and rankings</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={periodType} onValueChange={setPeriodType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleGenerateLeaderboard} 
            disabled={isGenerating}
            variant="outline"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Regenerate
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="leaderboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Performance Leaderboard
              </CardTitle>
              <CardDescription>
                {periodType === "monthly" ? "Monthly" : periodType === "quarterly" ? "Quarterly" : "Yearly"} rankings based on conversion rate, revenue, and response time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {leaderboardData?.data?.length > 0 ? (
                    leaderboardData.data.map((entry) => (
                      <div key={entry._id} className="flex items-center p-4 border rounded-lg">
                        <div className="flex items-center justify-center w-10 h-10 mr-4">
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={entry.representative?.profileDetails?.profileImage} />
                            <AvatarFallback>
                              {entry.representative?.profileDetails?.fullName?.charAt(0) || "R"}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-medium">
                              {entry.representative?.profileDetails?.fullName || "Unknown"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {entry.representative?.designation} • {entry.representative?.employeeId}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-500">Leads</p>
                            <p className="font-medium">{entry.metrics.leadsConverted}/{entry.metrics.totalLeadsAssigned}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Conversion</p>
                            <p className="font-medium">{entry.metrics.conversionRate.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="font-medium">৳{entry.metrics.revenueGenerated.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Points</p>
                            <p className="font-medium">{entry.points}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 ml-4">
                          {entry.badges.map((badge, index) => (
                            <Badge key={index} variant="outline" className={getBadgeColor(badge)}>
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No leaderboard data available</p>
                      <Button onClick={handleGenerateLeaderboard} className="mt-4">
                        Generate Leaderboard
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="top-performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                All-Time Top Performers
              </CardTitle>
              <CardDescription>
                Representatives with the best performance across all time periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topPerformersData?.data?.length > 0 ? (
                <div className="space-y-4">
                  {topPerformersData.data.map((performer, index) => (
                    <div key={performer.representative?._id} className="flex items-center p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 mr-4">
                        {index === 0 ? <Trophy className="h-5 w-5 text-yellow-500" /> : 
                         index === 1 ? <Trophy className="h-5 w-5 text-gray-400" /> : 
                         index === 2 ? <Trophy className="h-5 w-5 text-amber-700" /> : 
                         <span className="text-sm font-medium">#{index + 1}</span>}
                      </div>
                      
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={performer.representative?.profileDetails?.profileImage} />
                          <AvatarFallback>
                            {performer.representative?.profileDetails?.fullName?.charAt(0) || "R"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-medium">
                            {performer.representative?.profileDetails?.fullName || "Unknown"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {performer.representative?.designation} • {performer.representative?.employeeId}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-500">Avg Rank</p>
                          <p className="font-medium">{performer.avgRank.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Avg Points</p>
                          <p className="font-medium">{performer.avgPoints.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Leads</p>
                          <p className="font-medium">{performer.totalLeadsConverted}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Revenue</p>
                          <p className="font-medium">৳{performer.totalRevenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No top performers data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderBoardPage;