// "use client";

// import { useState } from "react";

// const languages = [
//   {
//     code: "BN",
//     name: "বাংলা",
//     icon: "/assets/flags/bdflag.png",
//   },
//   {
//     code: "EN",
//     name: "English",
//     icon: "/assets/flags/usflag.png",
//   },
// ];

// export default function LangSwitch(){
//   const [selectedLanguage, setSelectedLanguage] = useState("BN");
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLanguageChange = (langCode) => {
//     setSelectedLanguage(langCode);
//     setIsOpen(false);
//     // We're not controlling Google Translate anymore, just UI state
//   };

//   // Get current language details
//   const currentLanguage = languages.find(
//     (lang) => lang.code === selectedLanguage
//   );

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors cursor-pointer hover:bg-gray-100 border border-gray-300 bg-white"
//         aria-label="Language selector"
//       >
//         <span className="text-sm font-medium text-gray-700">
//           {currentLanguage?.name || "বাংলা"}
//         </span>
//         <svg
//           className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
//           <div className="py-1">
//             {languages.map((language) => (
//               <button
//                 key={language.code}
//                 onClick={() => handleLanguageChange(language.code)}
//                 className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
//                   selectedLanguage === language.code ? "bg-gray-50 text-blue-600 font-medium" : "text-gray-700"
//                 }`}
//               >
//                 <span>{language.name}</span>
//                 {selectedLanguage === language.code && (
//                   <svg className="ml-auto h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </div>
//   );
// };
