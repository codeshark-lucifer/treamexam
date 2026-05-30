"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

import { Button } from "@/components/ui/Button";

interface Question {
  id: string;
  categoryId: string;
  examType: string;
  questionKh: string;
  questionEn: string;
  optionsKh: string[];
  optionsEn: string[];
  answer: number;
}

interface PreparedQuestion extends Question {
  displayOptions: {
    textKh: string;
    textEn: string;
    originalIndex: number;
  }[];
}

interface Props {
  categoryId: string;
  examTypeId: string;
  questions: Question[];
}

export default function ExamInterface({
  categoryId,
  examTypeId,
  questions: initialQuestions,
}: Props) {
  const router = useRouter();

  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  // Prepare questions (shuffle options)
  useEffect(() => {
    const prepared = initialQuestions.map((q) => {
      const options = q.optionsKh.map((kh, index) => ({
        textKh: kh,
        textEn: q.optionsEn[index],
        originalIndex: index,
      }));

      // shuffle options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      return {
        ...q,
        displayOptions: options,
      };
    });

    setQuestions(prepared);
  }, [initialQuestions]);

  if (questions.length === 0) {
    return <div className="p-6">Loading...</div>;
  }

  const currentQuestion = questions[currentIndex];

  // NEXT QUESTION
  const handleNext = () => {
    if (selectedIndex === null) return;

    const selected =
      currentQuestion.displayOptions[selectedIndex];

    const isCorrect =
      selected.originalIndex === currentQuestion.answer;

    const result = {
      questionId: currentQuestion.id,
      question: currentQuestion.questionKh,
      selectedAnswer: selected.originalIndex,
      selectedText: selected.textKh,
      correctAnswer: currentQuestion.answer,
      correctText: currentQuestion.optionsKh[currentQuestion.answer],
      isCorrect,
    };

    const updated = [...answers, result];
    setAnswers(updated);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setSelectedIndex(null);
    } else {
      submitExam(updated);
    }
  };

  // SUBMIT EXAM
  const submitExam = async (finalAnswers: any[]) => {
    setLoading(true);

    const correctCount = finalAnswers.filter(
      (a) => a.isCorrect
    ).length;

    const score = Math.round(
      (correctCount / questions.length) * 100
    );

    try {
      const res = await fetch("/api/user/exam/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          examTypeId,
          score,
          totalQuestions: questions.length,
          correctAnswers: correctCount,
          answers: finalAnswers,
        }),
      });

      const data = await res.json();

      setResultData({
        score,
        correctCount,
        answers: finalAnswers,
        apiResultId: data.resultId,
      });
    } catch (err) {
      console.error("Submit error:", err);
    }

    setFinished(true);
    setLoading(false);
  };

  // RESULT SCREEN
  if (finished && resultData) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* SCORE */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Completed</CardTitle>
            <CardDescription>
              Your performance summary
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="text-5xl font-bold">
              {resultData.score}%
            </div>

            <p>
              Correct {resultData.correctCount} /{" "}
              {questions.length}
            </p>

            <div className="flex gap-4">
              <Button
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/user/dashboard")}
              >
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* REVIEW */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            Review Answers
          </h2>

          {resultData.answers.map((ans: any, index: number) => {
            const q = questions[index];

            const yourAnswer =
              q.optionsKh[ans.selectedAnswer];

            const correctAnswer =
              q.optionsKh[ans.correctAnswer];

            return (
              <Card
                key={index}
                className={`border ${
                  ans.isCorrect
                    ? "border-green-500/40"
                    : "border-red-500/40"
                }`}
              >
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold">
                    {q.questionKh}
                  </p>

                  <p
                    className={
                      ans.isCorrect
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {ans.isCorrect ? "✔ Correct" : "✘ Incorrect"}
                  </p>

                  <p className="text-sm">
                    Your answer: {yourAnswer}
                  </p>

                  {!ans.isCorrect && (
                    <p className="text-sm text-green-500">
                      Correct answer: {correctAnswer}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // PROGRESS
  const progress =
    ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="font-bold">
          Question {currentIndex + 1} of {questions.length}
        </h2>

        <div className="h-2 bg-muted rounded mt-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* QUESTION */}
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.questionKh}</CardTitle>
          <CardDescription>
            {currentQuestion.questionEn}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {currentQuestion.displayOptions.map((opt, index) => {
            const label = String.fromCharCode(65 + index);

            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-full p-4 border rounded-lg text-left transition ${
                  selectedIndex === index
                    ? "border-primary bg-primary/10"
                    : "hover:border-primary/40"
                }`}
              >
                <div className="font-bold mb-1">{label}</div>
                <div>{opt.textKh}</div>
                <div className="text-sm text-muted-foreground">
                  {opt.textEn}
                </div>
              </button>
            );
          })}
        </CardContent>

        {/* BUTTON */}
        <div className="p-6 pt-0 flex justify-end">
          <Button
            disabled={selectedIndex === null || loading}
            onClick={handleNext}
          >
            {currentIndex === questions.length - 1
              ? "Finish Exam"
              : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}