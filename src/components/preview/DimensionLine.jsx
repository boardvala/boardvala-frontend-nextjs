export default function DimensionLine({
  length,
  label,
  direction = "horizontal",
}) {
  const displayLabel =
    typeof label === "number"
      ? `${label} inch`
      : label.replace(/"/g, " inch");

  if (direction === "horizontal") {
    return (
      <svg
        width={length}
        height="30"
        style={{ overflow: "visible" }}
      >
        {/* Main Line */}
        <line
          x1="0"
          y1="15"
          x2={length}
          y2="15"
          stroke="#444"
          strokeWidth="1.5"
        />

        {/* Left Tick */}
        <line
          x1="0"
          y1="9"
          x2="0"
          y2="21"
          stroke="#444"
          strokeWidth="1.5"
        />

        {/* Right Tick */}
        <line
          x1={length}
          y1="9"
          x2={length}
          y2="21"
          stroke="#444"
          strokeWidth="1.5"
        />

        {/* Text */}
        <text
          x={length / 2}
          y="12"
          textAnchor="middle"
          fontWeight="600"
          fontSize="14"
          fill="#222"
        >
          {displayLabel}
        </text>
      </svg>
    );
  }

  return (
    <svg
      width="35"
      height={length}
      style={{ overflow: "visible" }}
    >
      {/* Main Line */}
      <line
        x1="18"
        y1="0"
        x2="18"
        y2={length}
        stroke="#444"
        strokeWidth="1.5"
      />

      {/* Top Tick */}
      <line
        x1="12"
        y1="0"
        x2="24"
        y2="0"
        stroke="#444"
        strokeWidth="1.5"
      />

      {/* Bottom Tick */}
      <line
        x1="12"
        y1={length}
        x2="24"
        y2={length}
        stroke="#444"
        strokeWidth="1.5"
      />

      {/* Text */}
      <text
        x="8"
        y={length / 2}
        transform={`rotate(-90 8 ${length / 2})`}
        textAnchor="middle"
        fontWeight="600"
        fontSize="14"
        fill="#222"
      >
        {displayLabel}
      </text>
    </svg>
  );
}