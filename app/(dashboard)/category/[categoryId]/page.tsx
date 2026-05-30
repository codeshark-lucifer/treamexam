import { redirect } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params;
    redirect(`/category/${categoryId}/exams`);
}
