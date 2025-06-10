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
import { useApplyProgram } from "@/services/participant/apply-program";
import { useSelfParticipant } from "@/services/participant/self-participant";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaClock } from "react-icons/fa6";
import { Link } from "react-router";
import { z } from "zod";

type Props = {
  programId: number;
  isLoggedIn: boolean;
};

const applyProgramSchema = z.object({
  motivation: z.string().min(100),
});

type FormValues = z.infer<typeof applyProgramSchema>;

const ApplyForProgramFlow = ({ programId, isLoggedIn }: Props) => {
  const [open, setOpen] = useState(false);

  const { selfParticipant, refetch } = useSelfParticipant(programId);

  const form = useForm<FormValues>({
    resolver: zodResolver(applyProgramSchema),
    defaultValues: {
      motivation: "",
    },
  });

  const { applyProgram, isPending: isApplyPending } = useApplyProgram();

  const onSubmit = async (values: FormValues) => {
    try {
      await applyProgram({
        programId,
        data: values,
      });
      setOpen(false);
      refetch();
    } catch {
      //
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isLoggedIn ? (
          <Button variant="primary">
            {selfParticipant && <FaClock className="size-4 text-white" />}
            Enroll
          </Button>
        ) : (
          <Button variant="primary" asChild>
            <Link to="/login">
              {selfParticipant && <FaClock className="size-4 text-yellow-500" />}
              Enroll
            </Link>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to join this program</DialogTitle>
          <DialogDescription>
            Share your motivation for joining this program. Your response will be reviewed by the
            mentor who leads this program to determine if it's a good fit.
          </DialogDescription>
        </DialogHeader>

        {selfParticipant ? (
          <>
            <div className="grid gap-2">
              <h3 className="flex items-center gap-2 text-neutral-700 font-medium">
                <FaClock className="size-4 text-yellow-500" />
                <span>You've already applied</span>
              </h3>
              <p className="text-neutral-500 text-sm leading-5">
                This is your program application. Please wait for it to be reviewed. You'll be
                notified once a decision has been made.
              </p>
              <Textarea value={selfParticipant.motivation} disabled />
              <time
                dateTime={selfParticipant.createdAt}
                className="text-[13px] text-neutral-500 text-end"
              >
                {format(selfParticipant.createdAt, "MMM d 'at' h:mm a")}
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
                    <FormLabel>
                      Why are you interested, and what do you hope to achieve through mentorship?
                    </FormLabel>
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
                <Button variant="primary" type="submit" disabled={isApplyPending}>
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

export default ApplyForProgramFlow;
