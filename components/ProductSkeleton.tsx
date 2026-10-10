export function ProductSkeleton() {
  return (
    <div className="card-soft p-4">
      <div className="flex gap-3">
        <div className="skeleton size-12 rounded-xl" />

        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div className="skeleton h-8 w-24 rounded" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}