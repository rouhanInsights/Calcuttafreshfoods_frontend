"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";

import { fetchAllProducts } from "@/lib/fetchProducts";
import { ProductCard } from "@/components/Products/ProductCard";
import { fetchCategories } from "@/lib/fetchCategories";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
  sale_price?: string;
  weight?: string;
  description?: string;
  short_description?: string;
  discount?: string;
  category_id?: number;
   in_stock?: boolean;
};

type Category = {
  category_id: number;
  category_name: string;
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart, removeFromCart, cart } = useCart();
  const quantity = cart.items.find((item) => item.id === id)?.quantity || 0;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);

  const itemsPerPage = 4;

  useEffect(() => {
    setMounted(true);
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    fetchAllProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Something went wrong while fetching products.");
      });
  }, []);

  if (!id || typeof id !== "string")
    return <p className="p-4 text-red-500">Invalid product ID</p>;
  if (loading) return <p className="p-4">Loading product details...</p>;
  if (!product) return <p className="p-4 text-red-500">Product not found</p>;
  if (error) return <p className="text-red-600 p-4">{error}</p>;

  const {
    name,
    image,
    price,
    sale_price,
    weight,
    description,
    short_description,
    discount,
    category_id,
  } = product;

  const categoryImages: Record<number, string> = {
    1: "/images/exclusive.png",
    2: "/images/Fish2.png",
    3: "/images/Mutton2.png",
    4: "/images/chicken.png",
    5: "/images/fillets2.jpg",
  };

  const relatedProducts = products.filter(
    (p) => p.category_id === category_id && p.id !== id
  );

  const totalPages = Math.ceil(relatedProducts.length / itemsPerPage);
  const paginatedProducts = relatedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const displayPrice = parseFloat(sale_price ?? price);
  const originalPrice = sale_price ? parseFloat(price) : null;
  const discountValue = parseInt(discount ?? "0", 10);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <>
      <section className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md mt-8">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-500 hover:text-black mb-6"
        >
          ← Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="relative aspect-square w-full max-w-md bg-gray-100 mx-auto mb-4 rounded-lg overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={name || "Product image"}
                priority
                className="object-center w-full h-full"
                height={300}
                width={500}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                <Image
                  src="/cp1.webp"
                  alt="Fallback Product Image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {discountValue > 0 && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                {discountValue}% OFF
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            <p className="text-sm text-gray-600">{weight || "Standard Pack"}</p>

            {short_description && (
              <p className="text-sm text-gray-500 italic">
                {short_description}
              </p>
            )}

            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                Product Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description || "No detailed description available."}
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 gap-4">
              <div className="text-3xl font-bold text-[#2F4F1C]">
                ₹{displayPrice.toFixed(2)}
                {originalPrice && (
                  <span className="text-lg text-gray-400 line-through ml-2 font-normal">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {quantity > 0 ? (
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden text-sm shadow">
                  <button
                    onClick={() => removeFromCart(id)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 flex justify-center items-center"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      addToCart({
                        id,
                        name,
                        price: displayPrice,
                        image,
                        weight,
                      })
                    }
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 flex justify-center items-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    addToCart({ id, name, price: displayPrice, image, weight })
                  }
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm shadow transition"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="p-6 m-5 max-w-6xl mx-auto bg-white rounded-xl shadow-md mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Desktop sidebar */}
          <div className="hidden md:block col-span-1 border-r border-gray-200 pr-3">
            <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">
              Available Product Categories
            </div>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.category_id}
                  href={`/category/${cat.category_id}`}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-green-300 transition cursor-pointer"
                >
                  <Image
                    src={categoryImages[cat.category_id]}
                    alt={cat.category_name}
                    className="w-10 h-10 rounded-md object-cover"
                    height={40}
                    width={40}
                  />
                  <span className="text-lg font-medium">
                    {cat.category_name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          {/* Mobile horizontal scroll */}
          <div className="md:hidden w-full bg-white px-4 py-4 overflow-x-auto">
          <div className="md:hidden px-4 text-sm font-semibold text-gray-700 mt-6 mb-2">
            Available Product Categories
          </div>
            <div className="flex gap-4 w-max pb-2">
              {categories.map((cat) => (
                <Link
                  key={cat.category_id}
                  href={`/category/${cat.category_id}`}
                  className="flex flex-col items-center min-w-[80px] px-2"
                >
                  <Image
                    src={categoryImages[cat.category_id]}
                    alt={cat.category_name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                    width={56}
                    height={56}
                  />
                  <span className="text-xs text-center mt-1 font-medium text-gray-700">
                    {cat.category_name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-2 pr-3">
            <h1 className="text-2xl font-sm mb-6 text-left text-gray-800 font-semibold ">
              More products you may like
            </h1>
            {relatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => {
                    const price = parseFloat(
                      product.sale_price ?? product.price
                    );
                    const discount = product.discount
                      ? parseInt(product.discount, 10)
                      : undefined;

                    return (
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        image={product.image}
                        price={price}
                        sale_price={
                          product.sale_price
                            ? parseFloat(product.sale_price)
                            : undefined
                        }
                        weight={product.weight}
                        description={product.description}
                        discount={discount}
                        key={product.id}
                        in_stock={product.in_stock ?? true} 
                      />
                    );
                  })}
                </div>
                <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                  {/* Prev Button */}
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={`px-2.5 py-1.5 rounded-full border shadow-sm text-xs sm:text-sm font-medium transition ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    ← Prev
                  </button>

                  {/* Leading Ellipsis */}
                  {page > 2 && (
                    <>
                      <button
                        onClick={() => setPage(1)}
                        className="w-10 h-10 rounded-full text-sm font-semibold border transition bg-white text-gray-700 hover:bg-green-100"
                      >
                        1
                      </button>
                      <span className="text-gray-500 text-sm px-2">...</span>
                    </>
                  )}

                  {/* Dynamic Page Buttons */}
                  {Array.from({ length: 3 }, (_, i) => {
                    const current =
                      page === 1
                        ? i + 1
                        : page === totalPages
                        ? page - 2 + i
                        : page - 1 + i;
                    if (current < 1 || current > totalPages) return null;
                    return (
                      <button
                        key={current}
                        onClick={() => setPage(current)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold border transition ${
                          current === page
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-700 hover:bg-green-100 border-gray-300"
                        }`}
                      >
                        {current}
                      </button>
                    );
                  })}

                  {/* Trailing Ellipsis */}
                  {page < totalPages - 1 && (
                    <>
                      <span className="text-gray-500 text-sm px-2">...</span>
                      <button
                        onClick={() => setPage(totalPages)}
                        className="w-10 h-10 rounded-full text-sm font-semibold border transition bg-white text-gray-700 hover:bg-green-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* Next Button */}
                  <button
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={`px-3 py-2 rounded-full border shadow-sm text-sm font-medium transition ${
                      page === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center">
                No related products found.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
