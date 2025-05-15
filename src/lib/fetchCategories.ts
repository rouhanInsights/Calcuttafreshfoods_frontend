export async function fetchCategories() {
    try {
    //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
    //     cache: "no-store",
    //   });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`,  
        { cache: "no-store",
         });
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
  
      return await res.json();
    } catch (error) {
      console.error("Fetch Categories Error:", error);
      return [];
    }
  }
  