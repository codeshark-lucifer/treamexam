import Link from "next/link";
import { headers } from "next/headers";

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
    return <div className="py-20 text-center text-[var(--muted)]">រកមិនឃើញប្រភេទវិញ្ញាសាឡើយ</div>;
  }

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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="bg-[var(--surface)] p-6 rounded-[var(--radius)] border border-[var(--line)] shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
          {category.titleKh}
        </h1>
        <p className="mt-1 text-[var(--muted)] font-medium">{category.titleEn}</p>
      </div>

      {/* EXAMS */}
      {examsWithCounts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {examsWithCounts.map((exam) => (
            <Link 
              key={exam.id}
              href={`/category/${categoryId}/exam/${exam.id}`}
              className="group bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] flex items-center gap-4 p-5 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-[var(--radius)] bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center text-xl shrink-0">
                <i className={`${exam.icon || 'fa-solid fa-graduation-cap'}`} />
              </div>

              <div className="flex-grow">
                <h3 className="font-bold text-lg leading-tight group-hover:text-[var(--primary)] transition-colors">
                  {exam.titleKh}
                </h3>
                <p className="text-sm text-[var(--muted)] mt-1 line-clamp-1">
                  {exam.titleEn}
                </p>
                <div className="mt-2 flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase bg-[var(--secondary)] text-[var(--primary)] px-2 py-0.5 rounded">
                     {exam.count} សំណួរ / Questions
                   </span>
                </div>
              </div>

              <i className="fa-solid fa-chevron-right text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] border-dashed rounded-[var(--radius)] p-12 text-center">
          <i className="fa-solid fa-folder-open text-4xl text-[var(--line)] mb-4 block"></i>
          <p className="text-[var(--muted)] font-medium">
            មិនទាន់មានវិញ្ញាសានៅក្នុងប្រភេទនេះនៅឡើយទេ។
          </p>
        </div>
      )}
    </div>
  );
}

