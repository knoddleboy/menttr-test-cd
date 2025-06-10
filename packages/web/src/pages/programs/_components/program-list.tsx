import PageLoading from "@/components/page-loading";
import ProgramUserCard from "@/components/program/program-user-card";
import { TabsEmpty } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { usePrograms } from "@/services/program/programs";
import { useFilteredPrograms } from "@/services/search/search-programs";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const ProgramList = () => {
  const { programs: fetchedPrograms, isPending } = usePrograms();

  const { control } = useFormContext();
  const values = useWatch({ control });
  const debouncedValues = useDebounce(values, 300);

  const isFilterActive = Object.entries(debouncedValues).some(
    ([_, value]) => !!value && value?.length
  );

  const { filteredPrograms } = useFilteredPrograms(
    {
      ...debouncedValues,
      skills: debouncedValues.skills.map((x) => x.name),
    },
    isFilterActive
  );

  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    setPrograms(filteredPrograms ? filteredPrograms : fetchedPrograms);
  }, [fetchedPrograms, filteredPrograms]);

  if (isPending) {
    return <PageLoading />;
  }

  return (
    <div className="divide-y divide-neutral-200">
      {programs?.items?.length ? (
        programs.items.map((program) => <ProgramUserCard key={program.id} program={program} />)
      ) : filteredPrograms ? (
        <TabsEmpty
          title="No results matching your search."
          subtitle="Please try different keywords or adjust your filters."
        />
      ) : (
        <TabsEmpty
          title="No programs to show right now."
          subtitle="When new programs are created, they'll appear here."
        />
      )}
    </div>
  );
};

export default ProgramList;
