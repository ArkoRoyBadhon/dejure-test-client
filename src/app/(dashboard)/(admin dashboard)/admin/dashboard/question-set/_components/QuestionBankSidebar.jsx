"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuestionBankSidebar({
  questionBank,
  selectedType,
  setSelectedType,
  selectedSubject,
  setSelectedSubject,
  searchTerm,
  setSearchTerm,
}) {
  const router = useRouter();
  return (
    <div className="w-80 bg-white h-[calc(100vh-64px)] border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b flex gap-1 items-center">
        <Button onClick={() => router.back()} variant="ghost">
          <ChevronLeft />
        </Button>
        <h2 className="text-lg font-semibold">Question Bank</h2>
        {/* <div className="mt-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div> */}
      </div>

      <ScrollArea className="flex-1 p-4 h-[calc(100vh-400px)]">
        {questionBank?.map((type) => (
          <div key={type._id} className="mb-4">
            <Button
              variant={selectedType?._id === type._id ? "secondary" : "ghost"}
              className="w-full justify-between"
              onClick={() => {
                setSelectedType(type);
                setSelectedSubject(null);
              }}
            >
              <div className="flex items-center max-w-[200px]">
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="text-left">{type.name}</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {type.totalQuestions}
                </Badge>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Button>

            {selectedType?._id === type._id && (
              <div className="ml-4 mt-2 space-y-1">
                {type.subjects?.map((subject) => (
                  <div key={subject._id}>
                    <Button
                      variant={
                        selectedSubject?._id === subject._id
                          ? "secondary"
                          : "ghost"
                      }
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => {
                        setSelectedSubject(subject);
                      }}
                    >
                      <div className="flex items-center max-w-[200px] overflow-hidden">
                        <FileText className="w-4 h-4 mr-2" />
                        <span className="text-left">{subject.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {subject.questionCount}
                        </Badge>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
