"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetLeadActivitiesQuery } from "@/redux/features/crm/crm.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, Activity as ActivityIcon, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ActivityPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: response, isLoading, error } = useGetLeadActivitiesQuery(id);

  const activities = response?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load activities");
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Failed to load activities</div>
        <Button onClick={() => router.refresh()}>Try Again</Button>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 mr-2" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 mr-2" />;
      case 'email':
        return <Mail className="h-4 w-4 mr-2" />;
      default:
        return <ActivityIcon className="h-4 w-4 mr-2" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'call':
        return 'default';
      case 'meeting':
        return 'secondary';
      case 'email':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lead Activities</h1>
          <p className="text-sm text-gray-500">Track all interactions with this lead</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/dashboard/crm/leads/details/${id}`)}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lead
        </Button>
      </div>

      {/* Activity List */}
      <Card className="border-0 shadow-sm">
        <div className="p-6">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <ActivityIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-gray-500 mb-4">No activities recorded yet</div>
              <Button onClick={() => router.push(`/admin/dashboard/crm/leads/details/${id}`)}>
                Start interacting with this lead
              </Button>
            </div>
          ) : (
            <Table className="border rounded-lg">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[25%]">Activity</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="w-[20%]">User</TableHead>
                  <TableHead className="w-[20%]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        {getActivityIcon(activity.type)}
                        <Badge 
                          variant={getBadgeVariant(activity.type)}
                          className="capitalize"
                        >
                          {activity.type?.replaceAll("_", " ") || "Activity"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-pre-wrap">
                      {activity.description || "No details provided"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        {activity.createdBy || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleString()
                          : "Unknown"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}