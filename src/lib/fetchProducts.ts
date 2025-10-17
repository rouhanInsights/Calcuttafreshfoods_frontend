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
  in_stock?: boolean | string; // ✅ allow string from JSON
  category_id?: number;
};

export async function fetchAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, {
    cache: "no-store",
  });
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
    in_stock: item.in_stock === true || item.in_stock === "true", // ✅ Strict boolean check
    category_id: item.category_id ?? undefined,
  }));
}

export async function fetchBestSellers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/best-sellers`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch best sellers");

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
    in_stock: item.in_stock === true || item.in_stock === "true", // ✅
    category_id: item.category_id ?? undefined,
  }));
}

export async function fetchTopOffers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/top-offers`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch top offers");

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
    in_stock: item.in_stock === true || item.in_stock === "true", // ✅
    category_id: item.category_id ?? undefined,
  }));
}

export async function fetchProductsByCategory(category_id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/category?category_id=${category_id}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch products by category");

  const data = await res.json();

  console.log("Category API data:", data); // ✅ Debug: Check what comes from backend

  return data.map((item: ProductFromAPI) => {
    const inStock = item.in_stock === true || item.in_stock === "true";
    console.log("Category item:", { name: item.name, inStock }); 
    console.log("RAW category data:", data); 
    console.log("Category data[0]:", data[0]); // ✅ Debug: See conversion
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      sale_price: item.sale_price ? parseFloat(item.sale_price) : undefined,
      image: item.image,
      weight: item.weight,
      discount: item.discount ? parseInt(item.discount) : 0,
      in_stock: inStock,
      category_id: item.category_id ?? undefined,
    };
  });
}

export async function fetchProductsBySearch(search: string, category?: string, limit?: number) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (limit) params.append("limit", String(limit));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to search products");

  const data = await res.json();

  console.log("Search API data:", data); // ✅ Debug

  return data.map((item: ProductFromAPI) => {
    const inStock = item.in_stock === true || item.in_stock === "true";
    console.log("Search item:", { name: item.name, inStock }); // ✅ Debug
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      sale_price: item.sale_price ? parseFloat(item.sale_price) : undefined,
      image: item.image,
      weight: item.weight,
      discount: item.discount ? parseInt(item.discount) : 0,
      in_stock: inStock,
      category_id: item.category_id ?? undefined,
    };
  });
}
