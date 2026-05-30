"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Answer {
  questionId: string;
  question?: string;
  selectedAnswer: number;
  selectedText?: string;
  correctAnswer: number;
  correctText?: string;
  isCorrect: boolean;
}

interface Props {
  answers: Answer[];
}

export default function ExamReview({ answers }: Props) {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {answers.map((a, i) => (
        <Card
          key={i}
          className={`border ${
            a.isCorrect ? "border-green-500/20" : "border-red-500/20"
          } bg-card/50`}
        >
          <CardContent className="p-3 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Question {i + 1}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  a.isCorrect
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {a.isCorrect ? "CORRECT" : "INCORRECT"}
              </span>
            </div>

            {/* Question text */}
            <p className="text-sm font-medium leading-tight">
              {a.question || `Question ID: ${a.questionId}`}
            </p>

            <div className="space-y-1.5 pt-1">
              {/* USER ANSWER */}
              <div
                className={`text-xs p-2 rounded border ${
                  a.isCorrect
                    ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400"
                    : "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400"
                }`}
              >
                <span className="font-bold">Your Answer:</span>{" "}
                {a.selectedText || `Option ${a.selectedAnswer}`}
              </div>

              {/* CORRECT ANSWER (if user was wrong) */}
              {!a.isCorrect && (
                <div className="text-xs p-2 rounded border border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400">
                  <span className="font-bold">Correct Answer:</span>{" "}
                  {a.correctText || `Option ${a.correctAnswer}`}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
