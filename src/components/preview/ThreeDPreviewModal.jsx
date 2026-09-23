import { useState, useEffect, useRef } from "react";

export default function ThreeDPreviewModal({
  isOpen,
  onClose,
  previewImage,
  material = "Acrylic",
  frameSize,
  frameWidth = 12,
  frameHeight = 6,
}) {
  const [rotX, setRotX] = useState(12);
  const [rotY, setRotY] = useState(-30);
  const [zoom, setZoom] = useState(1);
  const [autoSpin, setAutoSpin] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialRotX: 12, initialRotY: -30 });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Auto 360 Spin Loop
  useEffect(() => {
    if (!isOpen || !autoSpin || isDragging) return;
    const timer = setInterval(() => {
      setRotY((prev) => (prev + 1.2) % 360);
    }, 25);
    return () => clearInterval(timer);
  }, [isOpen, autoSpin, isDragging]);

  if (!isOpen) return null;

  // Calculate box dimensions inside modal (max box size ~320px)
  const MAX_BOX_SIZE = 320;
  let boxW = MAX_BOX_SIZE;
  let boxH = (MAX_BOX_SIZE * frameHeight) / frameWidth;
  if (boxH > MAX_BOX_SIZE) {
    boxH = MAX_BOX_SIZE;
    boxW = (MAX_BOX_SIZE * frameWidth) / frameHeight;
  }

  // 3mm Photo/Acrylic sheet thickness in 3D (approx 5px in CSS space)
  const depth = 5;

  const isAcrylic = material === "Acrylic";

  // Pointer drag event handlers for Desktop Mouse & Mobile Touch
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      initialRotX: rotX,
      initialRotY: rotY,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    setRotY((dragStartRef.current.initialRotY + deltaX * 0.7) % 360);
    setRotX(
      Math.max(
        -85,
        Math.min(85, dragStartRef.current.initialRotX - deltaY * 0.7),
      ),
    );
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotX(12);
    setRotY(-30);
    setZoom(1);
    setAutoSpin(true);
  };

  // Polished edges based on material
  const edgeColor =
    isAcrylic
      ? "rgba(225, 238, 252, 0.92)"
      : material === "MDF"
        ? "#734e34"
        : material === "Sunboard"
          ? "#e5e7eb"
          : "#2b2b2b";

  const backColor =
    isAcrylic
      ? "#e2e8f0"
      : material === "MDF"
        ? "#5c3d26"
        : material === "Sunboard"
          ? "#f3f4f6"
          : "#1e293b";

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(10, 15, 25, 0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 1060,
      }}
      onClick={onClose}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden position-relative"
        style={{
          width: "92%",
          maxWidth: "700px",
          backgroundColor: "#161d2a",
          color: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="card-header bg-transparent border-bottom border-secondary border-opacity-25 py-3 px-4 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-box-seam text-primary"></i> 3D View
            </h5>
            <small className="text-muted">
              {material} {isAcrylic ? "• Ultra Glossy Finish" : ""} • {frameSize || `${frameWidth}″ x ${frameHeight}″`}
            </small>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        {/* 3D Stage Window */}
        <div
          className="card-body position-relative d-flex justify-content-center align-items-center py-5 px-3 select-none"
          style={{
            minHeight: "420px",
            background:
              "radial-gradient(circle at 50% 30%, #253346 0%, #0f1520 80%)",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
          }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* Hint Overlay */}
          <div
            className="position-absolute top-0 start-50 translate-middle-x mt-3 px-3 py-1 rounded-pill text-white-50"
            style={{
              fontSize: "0.78rem",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(4px)",
              pointerEvents: "none",
            }}
          >
            <i className="bi bi-hand-index-thumb me-1"></i> Drag to rotate 360°
          </div>

          {/* 3D Viewport */}
          <div
            style={{
              perspective: "1000px",
              perspectiveOrigin: "50% 50%",
              display: "grid",
              placeItems: "center",
            }}
          >
            <div
              style={{
                width: `${boxW}px`,
                height: `${boxH}px`,
                position: "relative",
                transformStyle: "preserve-3d",
                transform: `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
            >
              {/* Front Face (Artwork + Glossy Acrylic Sheen Overlay) */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  transform: `translateZ(${depth / 2}px)`,
                  background: "#fff",
                  borderRadius: "4px",
                  overflow: "hidden",
                  boxShadow: isAcrylic
                    ? "0 0 20px rgba(0,0,0,0.35), inset 0 0 0 1.5px rgba(255,255,255,0.7)"
                    : "0 0 15px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.4)",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={previewImage}
                  alt="Front Preview"
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />

                {/* Glossy Acrylic Reflection Glare Overlay */}
                {isAcrylic && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0) 65%)",
                      pointerEvents: "none",
                      zIndex: 5,
                      boxShadow:
                        "inset 0 0 0 1.5px rgba(255, 255, 255, 0.85), inset 0 1px 4px rgba(255, 255, 255, 0.9)",
                    }}
                  />
                )}
              </div>

              {/* Back Face */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  transform: `rotateY(180deg) translateZ(${depth / 2}px)`,
                  background: backColor,
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                  backfaceVisibility: "hidden",
                }}
              >
                <i className="bi bi-shield-check fs-3 mb-1"></i>
                <span>{material} Backing</span>
                <small style={{ fontSize: "0.65rem", opacity: 0.7 }}>
                  BoardVala Genuine Quality
                </small>
              </div>

              {/* Top Edge (3mm thickness) */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: `${depth}px`,
                  top: 0,
                  left: 0,
                  transform: `rotateX(90deg) translateZ(${depth / 2}px)`,
                  background: edgeColor,
                  transformOrigin: "top",
                  filter: "brightness(0.95)",
                }}
              />

              {/* Bottom Edge (3mm thickness) */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: `${depth}px`,
                  bottom: 0,
                  left: 0,
                  transform: `rotateX(-90deg) translateZ(${depth / 2}px)`,
                  background: edgeColor,
                  transformOrigin: "bottom",
                  filter: "brightness(0.75)",
                }}
              />

              {/* Left Edge (3mm thickness) */}
              <div
                style={{
                  position: "absolute",
                  width: `${depth}px`,
                  height: "100%",
                  top: 0,
                  left: 0,
                  transform: `rotateY(-90deg) translateZ(${depth / 2}px)`,
                  background: edgeColor,
                  transformOrigin: "left",
                  filter: "brightness(0.85)",
                }}
              />

              {/* Right Edge (3mm thickness) */}
              <div
                style={{
                  position: "absolute",
                  width: `${depth}px`,
                  height: "100%",
                  top: 0,
                  right: 0,
                  transform: `rotateY(90deg) translateZ(${depth / 2}px)`,
                  background: edgeColor,
                  transformOrigin: "right",
                  filter: "brightness(0.8)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer Toolbar */}
        <div className="card-footer bg-transparent border-top border-secondary border-opacity-25 py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* Rotation & Zoom Controls */}
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm ${
                autoSpin ? "btn-primary" : "btn-outline-light"
              }`}
              onClick={() => setAutoSpin(!autoSpin)}
              title={autoSpin ? "Pause Auto-Rotate" : "Start Auto-Rotate"}
            >
              <i
                className={`bi ${
                  autoSpin ? "bi-pause-fill" : "bi-play-fill"
                } me-1`}
              ></i>
              {autoSpin ? "Auto-Spinning" : "Auto-Rotate"}
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              onClick={resetView}
              title="Reset view angle"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset View
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">Zoom:</small>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              >
                −
              </button>
              <span className="btn btn-outline-light disabled text-white px-2">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm px-4 fw-semibold"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
