import { notFound } from "next/navigation";
import { ProductCard } from "@/components/Products/ProductCard";

type Product = {
  product_id: number;
  name: string;
  price: number;
  sale_price?: number;
  weight: string;
  image_url: string;
  discount?: number;
};

type Category = {
  category_id: number;
  category_name: string;
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await getCategoryDetails(id);
  if (!category) return notFound();

  const products = await getCategoryProductsById(id);
  if (!products.length) return notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {category.category_name} Products
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((item) => {
          // ✅ Sanitize image URL if it contains comma-separated values
          const sanitizedImage = item.image_url.split(",")[0].trim();

          return (
            <ProductCard
              key={item.product_id}
              id={item.product_id.toString()}
              name={item.name}
              price={item.price}
              discount={item.discount}
              image={sanitizedImage}
              weight={item.weight}
            />
          );
        })}
      </div>
    </main>
  );
}

async function getCategoryDetails(id: string): Promise<Category | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Category fetch failed");
    return await res.json();
  } catch (error) {
    console.error("Category Fetch Error:", error);
    return null;
  }
}

async function getCategoryProductsById(id: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/category?category_id=${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Product fetch failed");
    return await res.json();
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return [];
  }
}
