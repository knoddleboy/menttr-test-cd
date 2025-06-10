import { useFormContext, useWatch } from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useMemo } from "react";
import { Input } from "../ui/input";
import TagsInput from "../tags-input";
import { useSkills } from "@/services/profile/skills";
import languages from "@/assets/languages.json";

const SearchFilters = () => {
  const { skills: allSkills } = useSkills();

  const { control, setValue, resetField, register } = useFormContext();
  const filters = useWatch({ control });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type) count += 1;
    if (filters.start_date) count += 1;
    if (filters.end_date) count += 1;
    if (filters.max_participants) count += 1;
    if (filters.skills.length) count += 1;
    if (filters.languages.length) count += 1;
    if (filters.location) count += 1;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    resetField("start_date");
    resetField("end_date");
    resetField("max_participants");
    resetField("location");
    setValue("type", "");
    setValue("skills", []);
    setValue("languages", []);
  };

  return (
    <div className="space-y-4">
      <div className="h-10 flex justify-between items-center">
        <div className="text-neutral-700 text-xl font-semibold">Filters</div>
        <div className="text-neutral-500 text-sm">{activeFilterCount} selected</div>
      </div>

      <div className="flex flex-col gap-4">
        <FormItem>
          <FormLabel>Program type</FormLabel>
          <FormControl>
            <Select value={filters.type} onValueChange={(val) => setValue("type", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select program type" />
              </SelectTrigger>
              <SelectContent align="center">
                <SelectItem value="1-on-1">1-on-1</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Start date</FormLabel>
          <FormControl>
            <Input {...register("start_date")} type="date" />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>End date</FormLabel>
          <FormControl>
            <Input {...register("end_date")} type="date" min={filters.start_date} />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Max participants</FormLabel>
          <FormControl>
            <Input
              {...register("max_participants")}
              placeholder="Max number of participants"
              type="number"
              min={1}
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Skills</FormLabel>
          <FormControl>
            <TagsInput
              value={filters.skills || []}
              onChange={(val) => setValue("skills", val)}
              allTags={allSkills || []}
              placeholder="Type to add skill"
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Language</FormLabel>
          <FormControl>
            <TagsInput
              value={filters.languages || []}
              onChange={(val) => setValue("languages", val)}
              allTags={languages}
              placeholder="Type to add language"
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl>
            <Input {...register("location")} placeholder="Location" />
          </FormControl>
        </FormItem>

        <Button variant="secondary" className="w-full" onClick={handleResetFilters}>
          Reset filters
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
