"use client";

interface ProgressChartProps {
  data: any[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-full w-full italic text-muted-foreground">
        Not enough data to generate a trend.
      </div>
    );
  }

  const width = 500;
  const height = 200;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate points
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - (item.score / 100) * chartHeight;
    return { x, y, score: item.score };
  });

  // Create SVG path string
  const pathD = points.reduce((acc, point, index) => {
    return acc + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
  }, "");

  // Area path (closes at the bottom)
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full h-[200px] relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((level) => {
            const y = padding + chartHeight - (level / 100) * chartHeight;
            return (
              <g key={level}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className="stroke-muted/20"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 5}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-muted-foreground font-medium"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={areaD}
            className="fill-primary/5 transition-all duration-1000"
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            className="stroke-primary transition-all duration-1000"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i} className="group">
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                className="fill-background stroke-primary group-hover:r-6 transition-all"
                strokeWidth="2"
              />
              <title>{`Attempt ${i + 1}: ${point.score}%`}</title>
            </g>
          ))}
        </svg>
      </div>
      
      <div className="flex justify-between w-full px-5 mt-4 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
        <span>Oldest</span>
        <span>Latest {data.length} attempts</span>
        <span>Newest</span>
      </div>
    </div>
  );
}
