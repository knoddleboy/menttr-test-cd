import GoBackButton from "@/components/go-back-button";
import TagsInput from "@/components/tags-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSkills } from "@/services/profile/skills";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ProgramTypeToggle from "../_components/program-type-toggle";
import { useCreateProgram } from "@/services/program/create-program";
import { useHeaderTitle } from "@/hooks/use-header-title";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import languages from "@/assets/languages.json";

const createProgramSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  type: z.enum(["1-on-1", "group"], { message: "Please select a program type." }),
  startDate: z.string(),
  endDate: z.string(),
  maxParticipants: z.coerce.number().min(1),
  skillIds: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .nonempty({ message: "At least one skill is required" }),
  languages: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

type FormValues = z.infer<typeof createProgramSchema>;

const CreateProgram = () => {
  useHeaderTitle("Create program");

  const { username } = useParams();
  const navigate = useNavigate();

  const { skills, isPending: isSkillsPending } = useSkills();
  const { createProgram, isPending: isCreatePending } = useCreateProgram();

  const form = useForm<FormValues>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "" as "1-on-1",
      startDate: "",
      endDate: "",
      maxParticipants: 1,
      skillIds: [],
      languages: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createProgram({
        ...values,
        endDate: values.endDate || undefined,
        skillIds: values.skillIds.map((x) => x.id),
      });
      // TODO: navigate to programs
      navigate(`/${username}`);
    } catch {
      //
    }
  };

  if (isSkillsPending) {
    return (
      <div className="flex justify-center items-center">
        <div className="fixed">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="max-w-xl mx-auto py-10 space-y-6">
        <div className="flex justify-between">
          <GoBackButton />
          <Button
            variant="primary"
            type="submit"
            form="create-program-form"
            disabled={isCreatePending}
          >
            Create
          </Button>
        </div>

        <Form {...form}>
          <form
            id="create-program-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div role="group" className="flex gap-5">
                      <ProgramTypeToggle
                        type="1-on-1"
                        isSelected={field.value === "1-on-1"}
                        onClick={() => form.setValue("type", "1-on-1")}
                      >
                        Provide personalized support to a mentee through regular one-on-one
                        sessions.
                      </ProgramTypeToggle>
                      <ProgramTypeToggle
                        type="group"
                        isSelected={field.value === "group"}
                        onClick={() => form.setValue("type", "group")}
                      >
                        Lead a small group of mentees by facilitating discussions, sharing
                        knowledge, and encouraging peer learning.
                      </ProgramTypeToggle>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea className="min-h-20" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Start date&nbsp;<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        className="block"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        className="block"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Max participants&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Skills&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field.value || []}
                      onChange={field.onChange}
                      allTags={skills}
                      placeholder="Type to add skill"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field.value || []}
                      onChange={field.onChange}
                      allTags={languages}
                      placeholder="Type to add language"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </main>
  );
};

export default CreateProgram;
