"use client";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const ModuleAccessCard = ({ module, isCustom = false, onToggle }) => {
  const handleToggle = (checked) => {
    if (onToggle) {
      onToggle(checked);
    }
  };

  return (
    <div
      className={`p-2 md:p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
        isCustom ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
      }`}
    >
      <div className="flex items-center justify-between mb-1 md:mb-2">
        <h4
          className={`text-xs font-medium ${
            isCustom ? "text-blue-800" : "text-green-800"
          }`}
        >
          {module?.module?.name}
        </h4>
        <Switch
          checked={module.isEnabled}
          onCheckedChange={handleToggle}
          className="h-4 w-7 data-[state=checked]:bg-green-500"
        />
      </div>
      <div className="text-xs text-gray-500 mb-1 md:mb-2">
        {isCustom ? "Custom permissions" : "From role"}
      </div>
      <div className="flex items-center gap-2">
        <Badge
          className={`text-xs ${
            isCustom
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {isCustom ? "Custom" : "Role"}
        </Badge>
      </div>
    </div>
  );
};
