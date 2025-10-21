"use client";

import {
  BookOpen,
  Search,
  FileText,
  Inbox,
  Bell,
  CreditCard,
  User,
  Play,
  Home,
  FileBarChart2,
  Calendar,
  Video,
  ClipboardCheck,
  LayoutDashboard,
  Layers,
  NotebookText,
  ClipboardList,
  Archive,
  FileStack,
  UserPlus,
  Users,
  Megaphone,
  TrendingUp,
  Package,
  Tag,
  Mail,
  Contact2,
  UserCog,
  Headphones,
  Trophy,
  Store,
  LineChart,
  FolderOpen,
  Briefcase,
  CaseSensitive,
  Newspaper,
  Shield,
  Globe,
  ChevronDown,
  ChevronRight,
  Boxes,
  ShoppingCart,
  Edit,
  Award,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export function DashboardSidebar({ onNavigate }) {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);

  // Single state for all expandable menus
  const [expandedMenus, setExpandedMenus] = useState({
    CRM: false,
    Store: false,
    Blog: false,
  });

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const isActive = (href, currentPath) => {
    const normalizedHref = href.replace(/\/+$/, "");
    const normalizedPath = currentPath.replace(/\/+$/, "");

    if (
      normalizedHref === "/dashboard" ||
      normalizedHref === "/mentor/dashboard" ||
      normalizedHref === "/admin/dashboard" ||
      normalizedHref === "/admin/dashboard/crm/dashboard"
    ) {
      return normalizedPath === normalizedHref;
    }

    return (
      normalizedPath === normalizedHref ||
      (normalizedPath.startsWith(`${normalizedHref}/`) &&
        normalizedPath !== normalizedHref)
    );
  };

  // Map module IDs to their corresponding paths
  const modulePathMap = {
    "68ea0ef238bf92f02d0b7a97": "/admin/dashboard",
    "68e9fa33581f56cb69781ce9": "/admin/dashboard/crm/dashboard",
    "68e9fa4512699fcfd4cd27de": "/admin/dashboard/crm/leads",
    "68e9fa4512699fcfd4cd27df": "/admin/dashboard/crm/tasks",
    "68e9fa4512699fcfd4cd27e0": "/admin/dashboard/crm/support",
    "68e9fa4512699fcfd4cd27e1": "/admin/dashboard/crm/leaderboard",
    "68e9fa4512699fcfd4cd27e2": "/admin/dashboard/crm/representatives",
    "68e9fa4512699fcfd4cd27e3": "/admin/dashboard/store/dashboard",
    "68e9fa4512699fcfd4cd27e4": "/admin/dashboard/store/products",
    "68e9fa4512699fcfd4cd27e5": "/admin/dashboard/store/categories",
    "68e9fa4512699fcfd4cd27e6": "/admin/dashboard/store/orders",
    "68e9fa4512699fcfd4cd27e7": "/admin/dashboard/category",
    "68e9fa4512699fcfd4cd27e8": "/admin/dashboard/curriculum",
    "68e9fa4512699fcfd4cd27e9": "/admin/dashboard/course",
    "68e9fa4512699fcfd4cd27ea": "/admin/dashboard/live-class",
    "68e9fa4512699fcfd4cd27eb": "/admin/dashboard/live-exam",
    "68e9fa4512699fcfd4cd27ec": "/admin/dashboard/question-bank",
    "68e9fa4512699fcfd4cd27ed": "/admin/dashboard/question-set",
    "68e9fa4512699fcfd4cd27ee": "/admin/dashboard/enrollment",
    "68e9fa4512699fcfd4cd27ef": "/admin/dashboard/manage-students",
    "68e9fa4512699fcfd4cd27f0": "/admin/dashboard/manage-promotion",
    "68e9fa4512699fcfd4cd27f1": "/admin/dashboard/notice",
    "68e9fa4512699fcfd4cd27f2": "/admin/dashboard/timeline",
    "68e9fa4512699fcfd4cd27f3": "/admin/dashboard/free-resources",
    "68e9fa4512699fcfd4cd27f4": "/admin/dashboard/blogs/dashboard",
    "68e9fa4512699fcfd4cd27f5": "/admin/dashboard/blogs/approval",
    "68e9fa4512699fcfd4cd27f6": "/admin/dashboard/sms-email",
    "68e9fa4512699fcfd4cd27f7": "/admin/dashboard/job-portal",
    "68e9fa4512699fcfd4cd27f8": "/admin/dashboard/case-study",
    "68e9fa4512699fcfd4cd27f9": "/admin/dashboard/manage-mentor",
    "68e9fa4512699fcfd4cd27fa": "/admin/dashboard/manage-website",
  };

  // Check if staff has access to a module
  // Check if staff has access to a module
  const hasAccess = (path) => {
    if (user?.role !== "staff") return true;

    // Find the module ID for this path
    const moduleId = Object.keys(modulePathMap).find(
      (key) => modulePathMap[key] === path
    );

    if (!moduleId) return false;

    // Check if module is enabled for this staff user
    const moduleAccess = user?.roleType?.moduleAccess?.find(
      (mod) => mod.module && mod.module._id === moduleId
    );

    return moduleAccess?.isEnabled;
  };

  const sidebarItems = {
    learner: [
      { icon: Home, label: "হোম", href: "/dashboard" },
      { icon: BookOpen, label: "আমার কোর্সসমূহ", href: "/dashboard/courses" },
      { icon: Search, label: "কোর্স এনরোল", href: "/dashboard/course-enroll" },
      { icon: FileText, label: "রিসোর্স", href: "/dashboard/resource" },
      { icon: Inbox, label: "ইনবক্স", href: "/dashboard/inbox" },
      {
        icon: FileBarChart2,
        label: "লার্নিং রিপোর্ট",
        href: "/dashboard/reports",
      },
      { icon: Bell, label: "নোটিশ বোর্ড", href: "/dashboard/notice" },
      {
        icon: CreditCard,
        label: "পেমেন্ট ও অর্ডার হিস্টরি",
        href: "/dashboard/payments",
      },
      {
        icon: Award,
        label: "সার্টিফিকেট",
        href: "/dashboard/certificates",
      },
      { icon: User, label: "প্রোফাইল", href: "/dashboard/profile" },
    ],
    mentor: [
      { icon: Home, label: "হোম", href: "/mentor/dashboard" },
      {
        icon: Calendar,
        label: "ক্লাস ক্যালেন্ডার",
        href: "/mentor/dashboard/class-calendar",
      },
      {
        icon: Video,
        label: "লাইভ ক্লাস",
        href: "/mentor/dashboard/live-class",
      },
      {
        icon: ClipboardCheck,
        label: "পরীক্ষার মূল্যায়ন",
        href: "/mentor/dashboard/exam-assessment",
      },
      { icon: Inbox, label: "ইনবক্স", href: "/mentor/dashboard/inbox" },
      { icon: Edit, label: "লিখা লিখি", href: "/mentor/dashboard/blogs" },
      { icon: User, label: "প্রোফাইল", href: "/mentor/dashboard/profile" },
    ],
    admin: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/admin/dashboard",
        moduleId: "689d8fb64b80d26196ce6a50",
      },

      {
        icon: Layers,
        label: "Category",
        href: "/admin/dashboard/category",
        moduleId: "689d8fb64b80d26196ce6a5a",
      },
      {
        icon: NotebookText,
        label: "Curriculum",
        href: "/admin/dashboard/curriculum",
        moduleId: "689d8fb64b80d26196ce6a5b",
      },
      {
        icon: BookOpen,
        label: "Course",
        href: "/admin/dashboard/course",
        moduleId: "689d8fb64b80d26196ce6a5c",
      },
      {
        icon: Video,
        label: "Live Class",
        href: "/admin/dashboard/live-class",
        moduleId: "689d8fb64b80d26196ce6a5d",
      },
      {
        icon: ClipboardList,
        label: "Live Exam",
        href: "/admin/dashboard/live-exam",
        moduleId: "689d8fb64b80d26196ce6a5e",
      },
      {
        icon: Archive,
        label: "Question Bank",
        href: "/admin/dashboard/question-bank",
        moduleId: "689d8fb64b80d26196ce6a5f",
      },
      {
        icon: FileStack,
        label: "Question Set",
        href: "/admin/dashboard/question-set",
        moduleId: "689d8fb64b80d26196ce6a60",
      },
      {
        icon: UserPlus,
        label: "Enrollment",
        href: "/admin/dashboard/enrollment",
        moduleId: "689d8fb64b80d26196ce6a61",
      },
      {
        icon: Users,
        label: "Manage Students",
        href: "/admin/dashboard/manage-students",
        moduleId: "689d8fb64b80d26196ce6a62",
      },
      // {
      //   icon: TrendingUp,
      //   label: "Manage Promotion",
      //   href: "/admin/dashboard/manage-promotion",
      //   moduleId: "689d8fb64b80d26196ce6a63",
      // },
      {
        icon: TrendingUp,
        label: "Manage Promotion",
        href: "/admin/dashboard/manage-promotion",
        moduleId: "689d8fb64b80d26196ce6a63",
        subItems: [
          // {
          //   icon: Package,
          //   label: "Bundle Course",
          //   href: "/admin/dashboard/manage-promotion/bundle-course",
          //   moduleId: "689d8fb64b80d26196ce6a64",
          // },
          {
            icon: Tag,
            label: "Promo Code",
            href: "/admin/dashboard/manage-promotion/coupon",
            moduleId: "689d8fb64b80d26196ce6a65",
          },
        ],
      },
      { icon: Bell, label: "Notice Board", href: "/admin/dashboard/notice" },
      // {
      //   icon: Mail,
      //   label: "SMS & Email",
      //   href: "/admin/dashboard/sms-email",
      //   moduleId: "689d8fb64b80d26196ce6a66",
      // },
      // {
      //   icon: LineChart,
      //   label: "Revenue & Report",
      //   href: "/admin/dashboard/revenue-report",
      //   moduleId: "689d8fb64b80d26196ce6a61",
      // },
      {
        icon: FolderOpen,
        label: "Free Resources",
        href: "/admin/dashboard/free-resources",
        moduleId: "689d8fb64b80d26196ce6a62",
      },
      {
        icon: Briefcase,
        label: "Job Portal",
        href: "/admin/dashboard/job-portal",
        moduleId: "689d8fb64b80d26196ce6a67",
      },
      {
        icon: CaseSensitive,
        label: "Timeline",
        href: "/admin/dashboard/timeline",
      },
      {
        icon: Contact2,
        label: "CRM",
        href: "/admin/dashboard/crm/dashboard",
        moduleId: "68e9fa33581f56cb69781ce9",
        subItems: [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/admin/dashboard/crm/dashboard",
            moduleId: "68e9fa33581f56cb69781ce9",
          },
          {
            icon: UserCog,
            label: "Leads",
            href: "/admin/dashboard/crm/leads",
            moduleId: "68e9fa4512699fcfd4cd27de",
          },
          {
            icon: ClipboardList,
            label: "Tasks",
            href: "/admin/dashboard/crm/tasks",
            moduleId: "68e9fa4512699fcfd4cd27df",
          },
          {
            icon: Headphones,
            label: "Course Support",
            href: "/admin/dashboard/crm/support",
            moduleId: "68e9fa4512699fcfd4cd27e0",
          },
          {
            icon: Trophy,
            label: "Leaderboard",
            href: "/admin/dashboard/crm/leaderboard",
            moduleId: "68e9fa4512699fcfd4cd27e1",
          },
          {
            icon: Users,
            label: "Representatives",
            href: "/admin/dashboard/crm/representatives",
            moduleId: "68e9fa4512699fcfd4cd27e2",
          },
        ],
      },
      {
        icon: Store,
        label: "Store",
        href: "/admin/dashboard/store",
        moduleId: "689d8fb64b80d26196ce6a60",
        subItems: [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/admin/dashboard/store/dashboard",
            moduleId: "689d8fb64b80d26196ce6a56",
          },
          {
            icon: Boxes,
            label: "Products",
            href: "/admin/dashboard/store/product",
            moduleId: "689d8fb64b80d26196ce6a57",
          },
          {
            icon: Layers,
            label: "Categories",
            href: "/admin/dashboard/store/category",
            moduleId: "689d8fb64b80d26196ce6a58",
          },
          {
            icon: ShoppingCart,
            label: "Orders",
            href: "/admin/dashboard/store/orders",
            moduleId: "689d8fb64b80d26196ce6a59",
          },
        ],
      },
      {
        icon: Newspaper,
        label: "Blog",
        href: "/admin/dashboard/blogs",
        moduleId: "689d8fb64b80d26196ce6a65",
        subItems: [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/admin/dashboard/blogs/dashboard",
          },
          {
            icon: Boxes,
            label: "Approval",
            href: "/admin/dashboard/blogs/approval",
          },
        ],
      },
      {
        icon: UserCog,
        label: "Manage Mentor",
        href: "/admin/dashboard/manage-mentor",
        moduleId: "689d8fb64b80d26196ce6a69",
      },
      {
        icon: Users,
        label: "Manage Staff",
        href: "/admin/dashboard/manage-staff",
        moduleId: "689d8fb64b80d26196ce6a67",
      },
      {
        icon: Shield,
        label: "Role and Permission",
        href: "/admin/dashboard/roles-permissions",
        moduleId: "689d8fb64b80d26196ce6a68",
      },
      {
        icon: Globe,
        label: "Manage Website",
        href: "/admin/dashboard/manage-website",
        moduleId: "689d8fb64b80d26196ce6a6a",
      },
    ],
  };

  // Filter sidebar items based on user permissions
  // Filter sidebar items based on user permissions
  const filterSidebarItems = (items) => {
    if (user?.role !== "staff") return items;

    return items
      .filter((item) => {
        // Check if item has subItems
        if (item.subItems) {
          // Filter subItems first
          const filteredSubItems = item.subItems.filter((subItem) =>
            hasAccess(subItem.href)
          );

          // Only keep the parent item if it has any accessible subItems
          return filteredSubItems.length > 0;
        }

        // For regular items, check access
        return hasAccess(item.href);
      })
      .map((item) => {
        // If it has subItems, return a new object with filtered subItems
        if (item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter((subItem) =>
              hasAccess(subItem.href)
            ),
          };
        }
        return item;
      });
  };

  // const currentSidebarItems =
  //   user?.role === "staff"
  //     ? filterSidebarItems(sidebarItems.admin)
  //     : sidebarItems[user?.role] || [];
  const currentSidebarItems =
    user?.role === "staff"
      ? filterSidebarItems(sidebarItems.admin)
      : user?.role === "representative"
      ? [
          {
            icon: Contact2,
            label: "CRM",
            href: "/admin/dashboard/crm/dashboard",
            subItems: [
              {
                icon: LayoutDashboard,
                label: "Dashboard",
                href: "/admin/dashboard/crm/dashboard",
                moduleId: "68e9fa33581f56cb69781ce9",
              },
              {
                icon: UserCog,
                label: "Leads",
                href: "/admin/dashboard/crm/leads",
                moduleId: "68e9fa4512699fcfd4cd27de",
              },
              {
                icon: ClipboardList,
                label: "Tasks",
                href: "/admin/dashboard/crm/tasks",
                moduleId: "68e9fa4512699fcfd4cd27df",
              },
              {
                icon: Headphones,
                label: "Course Support",
                href: "/admin/dashboard/crm/support",
                moduleId: "68e9fa4512699fcfd4cd27e0",
              },
              {
                icon: Trophy,
                label: "Leaderboard",
                href: "/admin/dashboard/crm/leaderboard",
                moduleId: "68e9fa4512699fcfd4cd27e1",
              },
            ],
          },
        ]
      : sidebarItems[user?.role] || [];

  return (
    <aside className="w-full h-[85vh] overflow-hidden bg-white border-r border-gray-200 lg:w-[264px] lg:sticky lg:customShadioow lg:top-0 lg:mx-2 lg:rounded-[12px] lg:mt-6 sidebarText border border-l">
      <div
        className={cn(
          "flex w-full items-center justify-left space-x-3 px-3 py-3 bg-main sidebarText text-darkColor text-center font-bold lg:rounded-t-[12px]"
        )}
      >
        {user?.role === "learner" && (
          <>
            <Image
              src="/assets/icons/student.svg"
              alt="Learner"
              width={20}
              height={20}
            />
            <span>Learner Dashboard</span>
          </>
        )}
        {user?.role === "mentor" && (
          <>
            <Image
              src="/assets/icons/student.svg"
              alt="Mentor"
              width={20}
              height={20}
            />
            <span>Mentor Dashboard</span>
          </>
        )}
        {(user?.role === "admin" || user?.role === "superadmin") && (
          <>
            <Image
              src="/assets/icons/student.svg"
              alt="Admin"
              width={20}
              height={20}
            />
            <span>Admin Dashboard</span>
          </>
        )}
        {user?.role === "staff" && (
          <>
            <Image
              src="/assets/icons/student.svg"
              alt="Admin"
              width={20}
              height={20}
            />
            <span>Staff Dashboard</span>
          </>
        )}
        {user?.role === "representative" && (
          <>
            <Image
              src="/assets/icons/student.svg"
              alt="Admin"
              width={20}
              height={20}
            />
            <span>Sales Dashboard</span>
          </>
        )}
      </div>
      <ScrollArea className="flex flex-col overflow-y-auto h-[calc(100vh-155px)] pb-[160px] 2xl:pb-[180px] relative">
        <nav className="flex-1 space-y-2">
          {currentSidebarItems.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 w-full text-left lg:rounded-r-[8px] transition-colors",
                      isActive(item.href, pathname) ||
                        item.subItems.some((subItem) =>
                          isActive(subItem.href, pathname)
                            ? "bg-main/5 text-darkColor lg:border-l-4 border-main font-bold"
                            : "text-gray-700 hover:bg-gray-100"
                        )
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="sidebarText flex-1">{item.label}</span>
                    {expandedMenus[item.label] ? (
                      <ChevronDown className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 flex-shrink-0" />
                    )}
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out mt-2 px-4",
                      expandedMenus[item.label] ? "max-h-[500px]" : "max-h-0"
                    )}
                  >
                    {item.subItems
                      .filter(
                        (subItem) =>
                          user?.role !== "staff" || hasAccess(subItem.href)
                      )
                      .map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center space-x-3 px-6 py-2 lg:rounded-[8px] transition-colors",
                            isActive(subItem.href, pathname)
                              ? "bg-main/10 text-darkColor font-bold"
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {subItem.icon && (
                            <subItem.icon className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="sidebarText">{subItem.label}</span>
                        </Link>
                      ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 lg:rounded-r-[8px] transition-colors",
                    isActive(item.href, pathname)
                      ? "bg-main/5 text-darkColor lg:border-l-4 border-main font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="sidebarText">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div className="px-4 hidden lg:block absolute bottom-0">
          <Card className="text-white border-none shadow-none relative overflow-hidden pt-0 pb-2 2xl:pb-6">
            <Image
              src="/assets/image/bg2.png"
              alt="ff"
              height={136}
              width={216}
              className="rounded-[16px]"
            />
          </Card>
        </div>
      </ScrollArea>
    </aside>
  );
}
