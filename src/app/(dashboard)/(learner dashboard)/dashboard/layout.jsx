"use client";

import { DashboardHeader } from "@/app/(dashboard)/(learner dashboard)/dashboard/_components/DashboardHeader";
import { DashboardSidebar } from "@/app/(dashboard)/(learner dashboard)/dashboard/_components/DashboardSider";
import AuthChecker from "@/Utils/AuthChecker";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const DashboardLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AuthChecker requiredRole="learner">
      <div className="h-[calc(100vh)] overflow-hidden bg-gray-50">
        <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />
        <div className="flex max-w-[1556px] mx-auto">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className=" h-[calc(100vh-72px)] w-[264px] z-30">
              <DashboardSidebar />
            </div>
          </div>

          {/* Mobile Sidebar */}
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="w-[280px] p-0">
              <DashboardSidebar
                onNavigate={() => setMobileSidebarOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <main className="flex-1 mt-2 px-4 lg:px-0 max-h-[calc(100vh-90px)] overflow-y-auto no-scrollbar">
            <div className="container mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AuthChecker>
  );
};

export default DashboardLayout;
