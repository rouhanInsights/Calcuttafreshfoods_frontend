// export async function fetchAllProducts() {
//   const res = await fetch("http://localhost:5000/api/products", { cache: "no-store" });
//   if (!res.ok) throw new Error("Failed to fetch products");
//   return res.json();
// }

type ProductFromAPI = {
  id: number;
  name: string;
  description: string;
  price: string;
  sale_price?: string;
  image: string;
  weight: string;
  discount?: string;
  stock_quantity?: number;
};

export async function fetchAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();

  return data.map((item: ProductFromAPI) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: parseFloat(item.price),
    sale_price: item.sale_price ? parseFloat(item.sale_price) : undefined,
    image: item.image,
    weight: item.weight,
    discount: item.discount ? parseInt(item.discount) : 0,
    stock_quantity: item.stock_quantity ?? 0,
  }));
}
