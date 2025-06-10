import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { RxMagnifyingGlass } from "react-icons/rx";
import { Button } from "../ui/button";

const SearchBar = () => {
  const { register, setValue } = useFormContext();

  return (
    <div className="relative flex gap-2">
      <RxMagnifyingGlass className="absolute top-[11px] left-[9px] size-4.5 text-neutral-500" />
      <Input {...register("query")} placeholder="Search programs" className="pl-8" />
      <Button variant="secondary" onClick={() => setValue("query", "")}>
        Clear
      </Button>
    </div>
  );
};

export default SearchBar;
