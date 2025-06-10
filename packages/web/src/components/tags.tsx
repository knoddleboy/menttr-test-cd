import { useState } from "react";
import { Badge } from "./ui/badge";

type Tag = {
  id: number | string;
  name: string;
};

type Props<T> = {
  tags: T[];
  visibleCount?: number;
  truncate?: boolean;
};

const Tags = <T extends Tag>({ tags, visibleCount = 5, truncate = false }: Props<T>) => {
  const [expanded, setExpanded] = useState(false);

  if (!tags.length) return null;

  const shouldCollapse = tags.length > visibleCount;
  const visibleTags = expanded || !shouldCollapse ? tags : tags.slice(0, visibleCount);
  const hiddenCount = tags.length - visibleCount;

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {visibleTags.map((tag) => (
        <Badge key={tag.id}>{tag.name}</Badge>
      ))}

      {!truncate && shouldCollapse && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-[15px] text-blue-500 hover:underline cursor-pointer"
        >
          +{hiddenCount} more
        </button>
      )}

      {!truncate && shouldCollapse && expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="text-[15px] text-blue-500 hover:underline cursor-pointer"
        >
          Show Less
        </button>
      )}
    </div>
  );
};

export default Tags;
