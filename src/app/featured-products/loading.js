import { SkeletonBox } from "../../components/Skeleton";

export default function Loading() {
  return (
    <div className="fp-wrap py-4 py-md-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="fp-head-title mb-1">Featured Products</h2>
          <p className="text-muted mb-0">
            Ready-to-order products, crafted and finished by BoardVala.
          </p>
        </div>

        <div className="row g-3 g-md-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div className="col-6 col-md-4 col-lg-3" key={i}>
              <div
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #ecedef",
                }}
              >
                <SkeletonBox height="200px" radius="0" />
                <div className="p-3">
                  <SkeletonBox height="10px" width="50px" className="mb-2" />
                  <SkeletonBox height="16px" width="75%" className="mb-2" />
                  <SkeletonBox height="18px" width="60px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}