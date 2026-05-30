import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

interface Category {
  id: string;
  titleKh: string;
  titleEn: string;
  shortTitleKh: string;
  shortTitleEn: string;
  image: string;
  color: string;
}

async function getCategories(): Promise<Category[]> {
  try {
    const host = (await headers()).get("host");

    if (!host) {
      return [];
    }

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const response = await fetch(
      `${protocol}://${host}/api/services/category`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch categories:", response.status);
      return [];
    }

    const data = await response.json();

    return data.categories ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function BrowseCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="bg-[var(--surface)] p-6 rounded-[var(--radius)] border border-[var(--line)] shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">ជ្រើសរើសវិញ្ញាសា / Browse Exams</h1>
        <p className="text-[var(--muted)] mt-1 font-medium">
          ជ្រើសរើសក្រសួង ឬស្ថាប័នដើម្បីមើលវិញ្ញាសាដែលមាន។
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/category/${category.id}/exams`}
              className="group relative bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] flex items-center gap-4 p-4 transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ borderLeft: `5px solid ${category.color || 'var(--primary)'}` }}
            >
              <div className="flex-shrink-0 w-16 h-16 relative">
                <Image
                  src={category.image}
                  alt={category.titleKh}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-[15px] leading-snug group-hover:text-[var(--primary)] transition-colors" style={{ color: category.color || 'var(--primary)' }}>
                  {category.titleKh}
                </h3>
                <p className="text-[12px] text-[var(--muted)] mt-1 line-clamp-1">
                  {category.titleEn}
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all"></i>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] border-dashed rounded-[var(--radius)] p-12 text-center">
          <i className="fa-solid fa-folder-open text-4xl text-[var(--line)] mb-4 block"></i>
          <p className="text-[var(--muted)] font-medium">មិនទាន់មានប្រភេទវិញ្ញាសាឡើយ។</p>
        </div>
      )}
    </div>
  );
}

