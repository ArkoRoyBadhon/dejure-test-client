import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle } from "lucide-react";
import { BookOpen } from "lucide-react";

export default function QuestionBrowser({
  selectedModule,
  selectedQuestions,
  addQuestionToSet,
}) {
  if (!selectedModule) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Select a Module
        </h3>
        <p className="text-gray-600">
          Choose a module from the sidebar to view available questions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{selectedModule.name} Questions</h3>
        <Badge variant="outline">
          {selectedModule.questions.length} available
        </Badge>
      </div>

      {selectedModule.questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          isSelected={!!selectedQuestions.find((q) => q.id === question.id)}
          onAdd={() => addQuestionToSet(question)}
          showAddButton
        />
      ))}
    </div>
  );
}

export function QuestionCard({
  question,
  isSelected,
  onAdd,
  showAddButton = true,
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={question.type === "mcq" ? "default" : "secondary"}>
              {question.type.toUpperCase()}
            </Badge>
            <Badge variant="outline">{question.difficulty}</Badge>
            <Badge variant="outline">{question.points} pts</Badge>
          </div>
          {showAddButton && (
            <Button size="sm" onClick={onAdd} disabled={isSelected}>
              {isSelected ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isSelected ? "Added" : "Add"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-medium mb-3">{question.question}</p>
        {question.type === "mcq" && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`p-2 rounded border ${
                  option === question.correctAnswer
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50"
                }`}
              >
                {String.fromCharCode(65 + index)}. {option}
                {option === question.correctAnswer && (
                  <CheckCircle className="w-4 h-4 text-green-600 inline ml-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
