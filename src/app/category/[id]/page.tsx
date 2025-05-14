import { notFound } from "next/navigation";
import { ProductCard } from "@/components/Products/ProductCard";
import { Suspense } from "react";
import CategorySkeleton from "@/components/Skeletons/CategorySkeleton";

type Product = {
  id: number;
  name: string;
  price: string;
  sale_price: string;
  discount: number;
  image: string;
  weight: string;
};

type Category = {
  category_id: number;
  category_name: string;
};
// Using `props: any` to bypass Next.js 15 type inference bug in dynamic routes.
// See: https://github.com/vercel/next.js/issues/55329
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function CategoryPage(props: any) {
  const { id } = props.params as { id: string };

  const category = await getCategory(id);
  if (!category) return notFound();

  const products = await getProductsByCategory(id);
  if (!products || products.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{category.category_name} Products</h1>
        <p className="text-gray-500">No products found for this category.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{category.category_name} Products</h1>
      <Suspense fallback={<CategorySkeleton />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id.toString()}
              name={item.name}
              price={parseFloat(item.price)}
              sale_price={
                item.sale_price ? parseFloat(item.sale_price) : undefined
              }
              discount={item.discount}
              image={item.image || "/cp2.webp"}
              weight={item.weight}
            />
          ))}
        </div>
      </Suspense>
    </main>
  );
}

async function getCategory(id: string): Promise<Category | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch category");
    return await res.json();
  } catch (err) {
    console.error("Category fetch error:", err);
    return null;
  }
}

async function getProductsByCategory(id: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/category?category_id=${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (err) {
    console.error("Product fetch error:", err);
    return [];
  }
}
