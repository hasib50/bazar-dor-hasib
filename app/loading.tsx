import { ProductSkeleton } from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <div className="container-page py-8">
      <div className="skeleton h-56 rounded-3xl" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}