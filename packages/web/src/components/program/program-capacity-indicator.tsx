import CircleProgress from "../circle-progress";

type Props = {
  current: number;
  max: number;
};

const ProgramCapacityIndicator = ({ current, max }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <CircleProgress current={current} max={max} size={16} strokeWidth={3} />

      <div className="flex items-center gap-0.5 text-[15px] text-neutral-700 leading-5">
        <span title="Active participants" className="hover:underline">
          {current}
        </span>
        /
        <span title="Max participants" className="hover:underline">
          {max}
        </span>
      </div>
    </div>
  );
};

export default ProgramCapacityIndicator;
