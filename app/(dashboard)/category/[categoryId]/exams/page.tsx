import Link from "next/link";
import { headers } from "next/headers";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { Button } from "@/components/ui/Button";

interface Category {
  id: string;
  titleKh: string;
  titleEn: string;
}

interface Exam {
  id: string;
  categoryId: string;
  titleKh: string;
  titleEn: string;
  descriptionKh: string;
  descriptionEn: string;
  icon?: string;
}

async function getCategory(id: string): Promise<Category | null> {
  const host = (await headers()).get("host");
  if (!host) return null;

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/services/category/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.data;
}

async function getExams(categoryId: string): Promise<Exam[]> {
  const host = (await headers()).get("host");
  if (!host) return [];

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/services/category/${categoryId}/exams`,
    { cache: "no-store" },
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.data ?? [];
}

// 🔥 NEW: get question count per exam
async function getQuestionCount(
  categoryId: string,
  examId: string,
): Promise<number> {
  const host = (await headers()).get("host");
  if (!host) return 0;

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/services/category/${categoryId}/questions?exam=${examId}`,
    { cache: "no-store" },
  );

  if (!res.ok) return 0;

  const data = await res.json();
  return data.data?.length ?? 0;
}

export default async function CategoryExamsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  const category = await getCategory(categoryId);
  const exams = await getExams(categoryId);

  if (!category) {
    return <div className="py-20 text-center">Category not found</div>;
  }

  // 🔥 Fetch counts in parallel
  const examsWithCounts = await Promise.all(
    exams.map(async (exam) => {
      const count = await getQuestionCount(categoryId, exam.id);

      return {
        ...exam,
        count,
      };
    }),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {category.titleKh}
        </h1>

        <p className="mt-2 text-muted-foreground">{category.titleEn}</p>
      </div>

      {/* EXAMS */}
      {examsWithCounts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {examsWithCounts.map((exam) => (
            <Card
              key={exam.id}
              className="group transition-all hover:border-primary/50 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  {exam.icon && (
                    <i className={`${exam.icon} text-2xl text-primary`} />
                  )}

                  <div>
                    <CardTitle>{exam.titleKh}</CardTitle>

                    <CardDescription>{exam.titleEn}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="mb-2 text-sm">{exam.descriptionKh}</p>

                <p className="mb-6 text-sm text-muted-foreground">
                  {exam.descriptionEn}
                </p>

                {/* 🔥 REAL COUNT */}
                <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Mixed Questions</span>

                  <span>{exam.count} Questions</span>
                </div>

                <Link href={`/category/${categoryId}/exam/${exam.id}`}>
                  <Button className="w-full">Start Exam</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No exams available for this category yet.
          </p>
        </Card>
      )}
    </div>
  );
}
