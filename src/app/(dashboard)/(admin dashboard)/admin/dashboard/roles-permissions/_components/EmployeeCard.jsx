"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, EyeOff, MoreVertical, Trash2 } from "lucide-react";

export const EmployeeCard = ({ employee, role, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 md:p-4 rounded-lg transition-all hover:shadow-md ${
        isSelected
          ? "bg-[#FDF5E5] border-2 border-[#DFB547] shadow-md"
          : "bg-white border border-gray-200 hover:bg-gray-50"
      } ${!employee.enabled ? "opacity-70" : ""}`}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="cursor-pointer flex-grow">
            <span className="font-medium text-gray-900">{employee.name}</span>
            <p className="text-sm text-gray-500">{employee.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Click to customize access
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="text-xs">
                {role?.name}
              </Badge>
              {employee.customAccess.length > 0 && (
                <Badge className="text-xs bg-blue-100 text-blue-800">
                  {employee.customAccess.length} custom
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Employee
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  Disable
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
