import { ProductSkeleton } from "@/components/ProductSkeleton";
export default function CategorySkeleton() { return <div className="container-page py-10"><div className="skeleton mb-6 h-28 rounded-2xl"/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><ProductSkeleton key={i}/>)}</div></div>; }
