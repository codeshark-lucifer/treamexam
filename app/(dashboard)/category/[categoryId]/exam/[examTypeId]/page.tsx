import { headers } from "next/headers";
import ExamInterface from "./ExamInterface";

export interface Question {
  id: string;
  categoryId: string;
  examType: string;

  questionKh: string;
  questionEn: string;

  optionsKh: string[];
  optionsEn: string[];

  answer: number;
  tags?: string[];
}

async function getQuestions(
  categoryId: string,
  examTypeId: string
): Promise<Question[]> {
  try {
    const host = (await headers()).get("host");

    if (!host) {
      return [];
    }

    const protocol =
      process.env.NODE_ENV === "development"
        ? "http"
        : "https";

    const response = await fetch(
      `${protocol}://${host}/api/services/category/${categoryId}/questions?exam=${examTypeId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to load questions:",
        response.status
      );
      return [];
    }

    const data = await response.json();

    const questions: Question[] = data.data ?? [];

    // Randomize question order only
    const shuffled = [...questions];

    for (
      let i = shuffled.length - 1;
      i > 0;
      i--
    ) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [shuffled[i], shuffled[j]] = [
        shuffled[j],
        shuffled[i],
      ];
    }

    return shuffled;
  } catch (error) {
    console.error(
      "Failed to fetch questions:",
      error
    );

    return [];
  }
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{
    categoryId: string;
    examTypeId: string;
  }>;
}) {
  const { categoryId, examTypeId } =
    await params;

  const questions = await getQuestions(
    categoryId,
    examTypeId
  );

  if (questions.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">
          No Questions Found
        </h1>

        <p className="text-muted-foreground">
          This exam currently has no
          questions.
        </p>
      </div>
    );
  }

  return (
    <ExamInterface
      categoryId={categoryId}
      examTypeId={examTypeId}
      questions={questions}
    />
  );
}