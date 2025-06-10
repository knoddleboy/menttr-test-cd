import { useState } from "react";

type Props = {
  text: string;
  maxLength?: number;
};

const ExpandableText = ({ text, maxLength = 350 }: Props) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > maxLength;
  const displayText = expanded || !isLong ? text : `${text.slice(0, maxLength)}...`;

  return (
    <p className="text-[15px] text-neutral-700 leading-5">
      {displayText}
      &nbsp;
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="inline text-blue-500 cursor-pointer hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </p>
  );
};

export default ExpandableText;
