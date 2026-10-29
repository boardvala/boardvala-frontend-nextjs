export default function Loading() {
  return (
    <div style={{ background: "#f6f7f9", minHeight: "70vh" }}>
      <div className="container py-4 py-md-5">
        {/* Header skeleton */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ width: "80px", height: "32px", background: "#e0e0e0", borderRadius: "6px", marginBottom: "12px", animation: "pulse 1.5s infinite" }} />
          <div style={{ width: "60%", height: "28px", background: "#e0e0e0", borderRadius: "6px", marginBottom: "8px", animation: "pulse 1.5s infinite" }} />
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "80px", height: "22px", background: "#e0e0e0", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
            <div style={{ width: "100px", height: "22px", background: "#e0e0e0", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
            <div style={{ width: "70px", height: "22px", background: "#e0e0e0", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
          </div>
        </div>

        {/* Image grid skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                background: "#e0e0e0",
                borderRadius: "12px",
                animation: "pulse 1.5s infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}