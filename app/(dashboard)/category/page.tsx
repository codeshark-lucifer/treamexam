import Image from "next/image";
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Categories</h1>

        <p className="text-muted-foreground">
          Select a subject area to view available exams.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group flex flex-col overflow-hidden transition-all hover:shadow-lg"
              style={{
                borderTop: `4px solid ${category.color}`,
              }}
            >
              <CardHeader className="space-y-4">
                <div className="relative h-40 w-full rounded-lg bg-muted">
                  <Image
                    src={category.image}
                    alt={category.titleEn}
                    fill
                    priority
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div>
                  <CardTitle className="text-lg">{category.titleKh}</CardTitle>

                  <CardDescription className="mt-1">
                    {category.titleEn}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="mt-auto">
                <Link href={`/category/${category.id}/exams`} className="block">
                  <Button
                    variant="outline"
                    className="w-full transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    View Exams
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      )}
    </div>
  );
}
