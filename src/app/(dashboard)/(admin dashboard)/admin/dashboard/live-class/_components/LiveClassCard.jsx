// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MoreVertical, Edit, Trash2, Calendar, Users } from "lucide-react";
// import Image from "next/image";
// import { format, parseISO, isValid } from "date-fns";
// import { bn } from "date-fns/locale";

// export default function LiveClassCard({ classData }) {
//   // Safe date parsing
//   const parseDateSafely = (dateString) => {
//     try {
//       if (!dateString) return new Date();
//       const date = parseISO(dateString);
//       return isValid(date) ? date : new Date();
//     } catch {
//       return new Date();
//     }
//   };

//   const examDate = parseDateSafely(classData?.scheduledDate);
//   const formattedDate = format(examDate, "dd MM yyyy", { locale: bn });
//   const formattedTime = classData?.scheduledTime || "--:--";

//   // Calculate time remaining (simplified example)
//   const timeRemaining = "2day 6hrs 5min";

//   return (
//     <Card className="w-full max-w-sm mx-auto bg-white shadow2 relative">
//       <div className="absolute top-3 right-3">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//               <MoreVertical className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem>
//               <Edit className="h-4 w-4 mr-2" />
//               Edit
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <Calendar className="h-4 w-4 mr-2" />
//               Reschedule
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <Users className="h-4 w-4 mr-2" />
//               View Participants
//             </DropdownMenuItem>
//             <DropdownMenuItem className="text-red-600">
//               <Trash2 className="h-4 w-4 mr-2" />
//               Delete
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <CardHeader className="pb-4">
//         <h2 className="text-[20px] leading-[150%] font-bold text-darkColor">
//           {classData?.title || "Live Exam"}
//         </h2>

//         <div className="flex items-center gap-3 mt-4">
//           <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden">
//             <Image
//               src="/assets/icons/avatar.png"
//               alt="Instructor"
//               height={48}
//               width={48}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div>
//             <h3 className="text-[16px] font-bold text-darkColor">
//               ফারিমা আক্তার
//             </h3>
//             <p className="text-[14px] text-darkColor">সরকারী জজ, সাফল্য আইন</p>
//           </div>
//         </div>

//         <div className="flex gap-2 mt-4">
//           <Badge
//             variant="secondary"
//             className="bg-blue/10 text-[14px] text-darkColor"
//           >
//             {timeRemaining}
//           </Badge>
//           <Badge
//             variant="secondary"
//             className="bg-main/10 text-[14px] text-darkColor"
//           >
//             Upcoming
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div className="bg-main/5 border border-main rounded-[16px] p-3 flex items-center gap-3">
//           <div className="w-[40px] h-[40px] bg-gray-200 rounded flex items-center justify-center">
//             <Image
//               src="/placeholder.svg?height=40&width=40"
//               alt="Course"
//               height={40}
//               width={40}
//               className="w-full h-full object-cover rounded-[16px]"
//             />
//           </div>
//           <span className="font-bold text-[16px] leading-[150%] text-darkColor">
//             {classData?.questionSet?.name || "Exam"}
//           </span>
//         </div>

//         <div className="space-y-3 text-sm">
//           <div className="flex justify-between">
//             <span className="text-deepGray">রেজিস্ট্রেশন</span>
//             <span className="text-darkColor font-bold text-[14px]">
//               {classData?.subject?.name || "N/A"}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-deepGray">ইনস্ট্রাক্টর</span>
//             <span className="text-darkColor font-bold text-[14px]">
//               {classData?.type || "N/A"}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-deepGray">তারিখ</span>
//             <span className="text-darkColor font-bold text-[14px]">
//               {formattedDate}, {formattedTime}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-deepGray">সময়</span>
//             <span className="text-darkColor font-bold text-[14px]">
//               {classData?.durationMinutes || 0} মিনিট
//             </span>
//           </div>
//         </div>

//         <Button className="w-full font-bold bg-white hover:bg-blue border border-blue text-darkColor hover:text-white mt-6">
//           জয়েন করুন
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
