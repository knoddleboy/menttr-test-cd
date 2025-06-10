import { useState } from "react";
import { Badge } from "./ui/badge";
import { FaTimesCircle } from "react-icons/fa";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { LuChevronsUpDown } from "react-icons/lu";
import { cn } from "@/libs/utils";

type Tag = {
  id: number | string;
  name: string;
};

type Props<T> = {
  value: T[];
  onChange: (tags: T[]) => void;
  allTags: T[];
  placeholder?: string;
  disabled?: boolean;
};

const TagsInput = <T extends Tag>({
  value,
  onChange,
  allTags,
  placeholder,
  disabled,
}: Props<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const matchingTags = allTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.find((t) => t.id === tag.id)
  );

  const addTag = (tag: T) => {
    onChange([...value, tag]);
    setInputValue("");
  };

  const removeTag = (tag: T) => {
    onChange(value.filter((t) => t.id !== tag.id));
  };

  const handleOpenMatchingList = () => {
    if (!matchingTags.length) return;
    setOpen((prev) => !prev);
  };

  return (
    <div
      className={cn("flex gap-1", disabled && "cursor-not-allowed pointer-events-none opacity-50")}
    >
      <div className="flex-1 border rounded-md p-2 min-h-10 flex flex-wrap gap-2 md:text-sm text-neutral-700 leading-5 shadow-xs">
        {value.map((tag) => (
          <Badge key={tag.id} className="flex items-center gap-1.5">
            {tag.name}
            <button
              type="button"
              className="text-neutral-700 hover:text-neutral-700/80 rounded-full outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1 active-effect cursor-pointer"
              onClick={() => removeTag(tag)}
            >
              <FaTimesCircle className="size-3" />
            </button>
          </Badge>
        ))}

        <input
          className="flex-1 outline-none"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
        />

        {(inputValue || open) && matchingTags.length > 0 && (
          <ScrollArea className="w-full max-h-48">
            {matchingTags.map((tag) => (
              <button
                key={tag.id}
                className="cursor-pointer w-full text-start hover:bg-neutral-200/50 active:bg-neutral-200/80 leading-5 rounded-sm px-2 py-1"
                onClick={() => addTag(tag)}
              >
                {tag.name}
              </button>
            ))}
          </ScrollArea>
        )}
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-10 h-10"
        onClick={handleOpenMatchingList}
      >
        <LuChevronsUpDown className="text-neutral-700 size-5" />
      </Button>
    </div>
  );
};

export default TagsInput;
