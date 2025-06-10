type Props = {
  current: number;
  max: number;
  size: number;
  strokeWidth: number;
};

const CircleProgress = ({ current, max, size = 20, strokeWidth = 4 }: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="block">
      {/* Background */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="text-neutral-200"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="none"
      />
      {/* Foreground (progress) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className={progress === 1 ? "text-green-500" : "text-orange-500"}
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

export default CircleProgress;
