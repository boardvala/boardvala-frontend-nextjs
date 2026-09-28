import { SkeletonBox } from "../../components/Skeleton";

export default function Loading() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Blog</h1>
      <div className="row g-4">
        {[1, 2, 3].map((i) => (
          <div className="col-12 col-md-6 col-lg-4" key={i}>
            <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #ecedef" }}>
              <SkeletonBox height="200px" radius="0" />
              <div className="p-3">
                <SkeletonBox height="12px" width="60px" className="mb-2" />
                <SkeletonBox height="20px" width="90%" className="mb-2" />
                <SkeletonBox height="14px" width="100%" className="mb-1" />
                <SkeletonBox height="14px" width="70%" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}