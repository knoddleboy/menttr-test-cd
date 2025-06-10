import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useConvertMentor } from "@/services/user/convert-mentor";
import { useAuthStore } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { FaClock } from "react-icons/fa6";
import { useState } from "react";

type Props = {
  trigger: React.ReactNode;
};

const cenvertMentorSchema = z.object({
  motivation: z.string().min(100),
});

type FormValues = z.infer<typeof cenvertMentorSchema>;

const ConvertMentorFlow = ({ trigger }: Props) => {
  const { convertMentor, isPending } = useConvertMentor();

  const user = useAuthStore((state) => state.user);
  const pendingApplication = user?.mentorApplications?.filter((x) => x.status === "pending")?.[0];

  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(cenvertMentorSchema),
    defaultValues: {
      motivation: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await convertMentor(values);
      setOpen(false);
    } catch {
      //
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch to mentor profile</DialogTitle>
          <DialogDescription>
            Activate your mentor profile to begin your journey as a mentor. You'll still be able to
            join programs and learn from other mentors as a mentee.
          </DialogDescription>
        </DialogHeader>

        {pendingApplication ? (
          <>
            <div className="grid gap-2">
              <h3 className="flex items-center gap-2 text-neutral-700 font-medium">
                <FaClock className="size-4 text-yellow-500" />
                <span>You've already applied</span>
              </h3>
              <p className="text-neutral-500 text-sm leading-5">
                This is your most recent mentor application. Please wait for it to be reviewed.
                You'll be notified once a decision has been made.
              </p>
              <Textarea value={pendingApplication.motivation} disabled />
              <time
                dateTime={pendingApplication.createdAt}
                className="text-[13px] text-neutral-500 text-end"
              >
                {format(pendingApplication.createdAt, "MMM d 'at' h:mm a")}
              </time>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What motivates you to become a mentor?</FormLabel>
                    <FormControl>
                      <Textarea {...field} required />
                    </FormControl>
                    <FormDescription>
                      Motivation must be at least 100 characters long.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="primary" type="submit" disabled={isPending}>
                  Apply
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConvertMentorFlow;
