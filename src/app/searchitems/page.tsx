import { notFound } from "next/navigation";
import { ProductCard } from "@/components/Products/ProductCard";

type Product = {
  id: number;
  name: string;
  price: string;
  sale_price?: string;
  description?: string;
  image: string;
  weight: string;
  discount?: string;
  in_stock?: boolean;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;

  if (!query) return notFound();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?search=${query}`,
    {
      cache: "no-store",
    }
  );

  
  if (!res.ok) return notFound();

  const products: Product[] = await res.json();

  if (!products.length) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-4">
          No results found for “{query}”
        </h2>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold mb-4">
        Search results for “{query}”
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id.toString()}
            name={item.name}
            description={item.description}
            price={parseFloat(item.price)}
            sale_price={item.sale_price ? parseFloat(item.sale_price) : undefined}
            image={item.image}
            weight={item.weight || "—"}
            discount={item.discount ? parseInt(item.discount) : undefined}
            in_stock={item.in_stock}
          />
        ))}
      </div>
    </main>
  );
}
