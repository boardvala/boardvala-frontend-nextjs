import { SkeletonProductCard } from "../../components/Skeleton";

export default function Loading() {
  return (
    <div className="container py-5">
      <h2 className="mb-4">All Designs</h2>
      <div className="row">
        <SkeletonProductCard />
        <SkeletonProductCard />
        <SkeletonProductCard />
        <SkeletonProductCard />
      </div>
    </div>
  );
}