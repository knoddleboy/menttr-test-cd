import SearchBar from "@/components/search/search-bar";
import SearchFilters from "@/components/search/search-filters";
import { useHeaderTitle } from "@/hooks/use-header-title";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import ProgramList from "./_components/program-list";

const searchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(["1-on-1", "group"]).optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  max_participants: z.number().optional(),
  skills: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  languages: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  location: z.string(),
});

type FormValues = z.infer<typeof searchSchema>;

const Programs = () => {
  useHeaderTitle("Programs");

  const form = useForm<FormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
      type: "" as "1-on-1",
      start_date: undefined,
      end_date: undefined,
      max_participants: undefined,
      skills: [],
      languages: [],
      location: "",
    },
  });

  return (
    <FormProvider {...form}>
      <main className="grid grid-cols-[384px_1fr]">
        <aside>
          <div className="fixed overflow-y-auto w-96 h-[calc(100dvh-72px)] p-4 border-r border-neutral-200 bg-white z-1">
            <SearchFilters />
          </div>
        </aside>

        <div className="flex flex-col gap-10">
          <div className="fixed w-[calc(100%-456px)] p-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md z-1">
            <SearchBar />
          </div>

          <div className="flex-1 mt-[72px]">
            <ProgramList />
          </div>
        </div>
      </main>
    </FormProvider>
  );
};

export default Programs;
