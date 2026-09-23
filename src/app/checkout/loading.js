export default function Loading() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="spinner-border text-dark mb-3"></div>
      <p className="text-muted mb-0">Preparing Checkout...</p>
    </div>
  );
}