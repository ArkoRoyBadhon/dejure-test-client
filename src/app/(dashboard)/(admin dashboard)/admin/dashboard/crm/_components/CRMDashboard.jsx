"use client";
import React from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  ClipboardCheck,
  Headphones,
  Trophy,
  ArrowUpRight,
  ChevronRight,
  Search,
  MoreHorizontal,
  Clock,
  Calendar,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCRMStatsQuery,
  useGetRecentLeadsQuery,
  useGetSalesPipelineQuery,
  useGetUserTasksQuery,
} from "@/redux/features/crm/crm.api";

export default function CRMDashboard() {
  // Fetch data using the provided hooks
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetCRMStatsQuery();

  const {
    data: recentLeadsData,
    isLoading: leadsLoading,
    isError: leadsError,
  } = useGetRecentLeadsQuery(5);

  const {
    data: salesPipelineData,
    isLoading: pipelineLoading,
    isError: pipelineError,
  } = useGetSalesPipelineQuery();

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetUserTasksQuery(3);

  // Format stats data
  const stats = statsData?.data || [
    { title: "Total Leads", value: "1,245", change: "+12%", icon: Users },
    { title: "Conversion Rate", value: "23%", change: "+2%", icon: TrendingUp },
    { title: "Active Tasks", value: "56", change: "+5", icon: ClipboardCheck },
    { title: "Support Tickets", value: "18", change: "-3", icon: Headphones },
    { title: "Leaderboard Top", value: "John D.", icon: Trophy },
  ];

  // Format recent leads data
  const recentLeads = recentLeadsData?.data || [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechSolutions Inc.",
      email: "sarah@tech.com",
      phone: "+880 123 456789",
      status: "New",
      lastContact: "2 hours ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Digital Innovations",
      email: "michael@digital.com",
      phone: "+880 987 654321",
      status: "Contacted",
      lastContact: "1 day ago",
    },
    {
      id: 3,
      name: "Emma Williams",
      company: "Global Systems",
      email: "emma@global.com",
      phone: "+880 456 789123",
      status: "Qualified",
      lastContact: "3 days ago",
    },
    {
      id: 4,
      name: "David Brown",
      company: "Future Tech",
      email: "david@future.com",
      phone: "+880 789 123456",
      status: "Proposal Sent",
      lastContact: "1 week ago",
    },
    {
      id: 5,
      name: "Lisa Rahman",
      company: "Bangla Solutions",
      email: "lisa@bangla.com",
      phone: "+880 321 654987",
      status: "Negotiation",
      lastContact: "2 weeks ago",
    },
  ];

  // Format tasks data
  const tasks = tasksData?.data || [
    {
      id: 1,
      title: "Follow up with TechSolutions",
      due: "Today",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Prepare proposal for Digital Innovations",
      due: "Tomorrow",
      priority: "Medium",
      completed: false,
    },
    {
      id: 3,
      title: "Schedule meeting with Global Systems",
      due: "Jul 25",
      priority: "Low",
      completed: true,
    },
  ];

  // Format sales pipeline data
  const salesProgress = salesPipelineData?.data || [
    { stage: "Leads", value: 1245 },
    { stage: "Contacted", value: 845 },
    { stage: "Qualified", value: 512 },
    { stage: "Proposal Sent", value: 287 },
    { stage: "Closed Won", value: 156 },
  ];

  // Calculate max value for progress bars
  const maxValue = Math.max(...salesProgress.map((item) => item.value));

  // Loading state component
  if (statsLoading || leadsLoading || pipelineLoading || tasksLoading) {
    return (
      <div className="space-y-6 mx-6 my-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-2 w-48" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-2 w-48" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Skeleton className="h-5 w-5 rounded-full mt-1" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-md" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error state component
  if (statsError || leadsError || pipelineError || tasksError) {
    return (
      <div className="space-y-6 mx-6 my-4">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-500">
              Failed to load dashboard data. Please try again later.
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">CRM Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search CRM..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
            />
          </div>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              {index === 0 && <Users className="h-5 w-5 text-gray-400" />}
              {index === 1 && <TrendingUp className="h-5 w-5 text-gray-400" />}
              {index === 2 && (
                <ClipboardCheck className="h-5 w-5 text-gray-400" />
              )}
              {index === 3 && <Headphones className="h-5 w-5 text-gray-400" />}
              {index === 4 && <Trophy className="h-5 w-5 text-gray-400" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p
                  className={`text-xs flex items-center mt-1 ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Leads</span>
                <Button variant="ghost" size="sm" className="text-main">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{lead.email}</span>
                          <span className="text-xs text-gray-500">
                            {lead.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            lead.status === "New"
                              ? "default"
                              : lead.status === "Contacted"
                              ? "secondary"
                              : lead.status === "Qualified"
                              ? "outline"
                              : "success"
                          }
                        >
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.lastContact}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Sales Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesProgress.map((step, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{step.stage}</span>
                      <span className="text-sm text-gray-500">
                        {step.value}
                      </span>
                    </div>
                    <Progress
                      value={(step.value / maxValue) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Tasks</span>
                <Button variant="ghost" size="sm" className="text-main">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="mr-3 mt-1">
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Due {task.due}
                        <Badge
                          variant={
                            task.priority === "High"
                              ? "destructive"
                              : task.priority === "Medium"
                              ? "warning"
                              : "outline"
                          }
                          className="ml-2"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
