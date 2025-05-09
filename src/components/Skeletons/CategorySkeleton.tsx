export default function CategorySkeleton() {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-gray-100 h-64" />
        ))}
      </div>
    );
  }
  