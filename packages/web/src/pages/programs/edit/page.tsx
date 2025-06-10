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
import { Textarea } from "@/components/ui/textarea";
import { useSkills } from "@/services/profile/skills";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ProgramTypeToggle from "../_components/program-type-toggle";
import { useHeaderTitle } from "@/hooks/use-header-title";
import { useEffect } from "react";
import { useProgram } from "@/services/program/program";
import { useNavigate, useParams } from "react-router";
import PageLoading from "@/components/page-loading";
import { format } from "date-fns";
import { useUpdateProgram } from "@/services/program/update-program";
import { useDeleteProgram } from "@/services/program/delete-program";
import { useArchiveProgram } from "@/services/program/archive-program";
import languages from "@/assets/languages.json";

const updateProgramSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  type: z.enum(["1-on-1", "group"], { message: "Please select a program type." }),
  startDate: z.string(),
  endDate: z
    .union([z.string(), z.null()])
    .refine((val) => val === null || !isNaN(Date.parse(val)))
    .optional(),
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

type FormValues = z.infer<typeof updateProgramSchema>;

const EditProgram = () => {
  useHeaderTitle("Edit Program");

  const { username, programId } = useParams();
  const navigate = useNavigate();

  const { program, isPending: isProgramPending } = useProgram(+programId!);
  const { skills, isPending: isSkillsPending } = useSkills();
  const { updateProgram, isPending: isUpdatePending } = useUpdateProgram();
  const { deleteProgram, isPending: isDeletePending } = useDeleteProgram();
  const { archiveProgram, isPending: isArchivePending } = useArchiveProgram();

  const form = useForm<FormValues>({
    resolver: zodResolver(updateProgramSchema),
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

  useEffect(() => {
    if (program) {
      form.reset({
        title: program.title,
        description: program.description,
        type: program.type,
        startDate: format(program.startDate, "yyyy-MM-dd"),
        endDate: program.endDate && format(program.endDate, "yyyy-MM-dd"),
        maxParticipants: program.maxParticipants,
        skillIds: program.skills,
        // TODO: add values from server
        languages: [],
      });
    }
  }, [program, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProgram({
        programId: program.id,
        data: {
          ...values,
          skillIds: values.skillIds.map((x) => x.id),
        },
      });
    } catch {
      //
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this program?\n\nThis action is permanent and cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteProgram(program.id);
      // TODO: navigate to /programs
      navigate(`/${username}`);
    } catch {
      //
    }
  };

  const onArchive = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this program?\n\nThis action cannot be undone. Once archived, the program will be locked and no longer editable or active.\n\nArchived programs will remain publicly visible from your profile."
    );
    if (!confirmed) return;

    try {
      await archiveProgram(program.id);
      // TODO: navigate to /programs
      navigate(`/${username}`);
    } catch {
      //
    }
  };

  if (isProgramPending || isSkillsPending) {
    return <PageLoading />;
  }

  const isEnrollment = program.status === "enrollment";

  return (
    <main>
      <div className="max-w-xl mx-auto py-10 space-y-6">
        <div className="flex justify-between">
          <GoBackButton />
          <Button
            variant="secondary"
            type="submit"
            form="update-program-form"
            disabled={isUpdatePending || !form.formState.isDirty}
          >
            Save changes
          </Button>
        </div>
        <Form {...form}>
          <form
            id="update-program-form"
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
                        onClick={() => form.setValue("type", "1-on-1", { shouldDirty: true })}
                        disabled={!isEnrollment}
                      >
                        Provide personalized support to a mentee through regular one-on-one
                        sessions.
                      </ProgramTypeToggle>
                      <ProgramTypeToggle
                        type="group"
                        isSelected={field.value === "group"}
                        onClick={() => form.setValue("type", "group", { shouldDirty: true })}
                        disabled={!isEnrollment}
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
                    <Input {...field} disabled={!isEnrollment} required />
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
                    <Textarea {...field} className="min-h-20" disabled={!isEnrollment} required />
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
                        {...field}
                        type="date"
                        className="block"
                        disabled={!isEnrollment}
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
                        {...field}
                        value={field.value ?? ""}
                        type="date"
                        className="block"
                        disabled={!isEnrollment}
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
                    <Input {...field} type="number" min={1} disabled={!isEnrollment} />
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
                      disabled={!isEnrollment}
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
        <div className="flex flex-col gap-2">
          <div className="text-sm text-neutral-500 font-medium">Danger zone</div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onArchive} disabled={isArchivePending}>
              Archive
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={isDeletePending}>
              Delete program
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditProgram;
