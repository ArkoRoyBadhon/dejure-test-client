import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Building2, Clock, DollarSign } from "lucide-react";

export function JobCard({ title, salary, location, company, experience }) {
  return (
    <Card className="p-4 sm:p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{salary}</span>
            </div>

            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{company}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{experience}</span>
            </div>
          </div>
        </div>

        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-2 rounded-md w-full sm:w-auto">
          Apply Now
        </Button>
      </div>
    </Card>
  );
}
