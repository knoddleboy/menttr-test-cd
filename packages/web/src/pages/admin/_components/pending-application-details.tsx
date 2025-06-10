import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateMentorApplicationStatus } from "@/services/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  application: any;
  onDecisionSuccess?: () => void;
};

const formSchema = z.object({
  reason: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const PendingApplicationDetails = ({ application, onDecisionSuccess }: Props) => {
  const user = application.user;

  const [open, setOpen] = useState(false);

  const { updateMentorApplicationStatus, isPending } = useUpdateMentorApplicationStatus();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (values: FormValues, event?: React.BaseSyntheticEvent) => {
    const nativeEvent = event?.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement;
    const status = submitter?.value;

    try {
      await updateMentorApplicationStatus({
        id: application.id,
        dto: {
          reason: values.reason,
          status,
        },
      });

      setOpen(false);
      onDecisionSuccess?.();
    } catch {
      //
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          View
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.name}'s application</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2">
          <h3 className="items-center gap-2 text-neutral-700 font-medium">Motivation</h3>
          <div className="overflow-hidden">
            <p className="text-neutral-500 text-sm leading-5">{application.motivation}</p>
          </div>

          <Separator className="my-2" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decision</FormLabel>
                    <FormControl>
                      <Textarea {...field} required />
                    </FormControl>
                    <FormDescription>
                      Provide a reason or additional context for your decision.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" value="rejected" variant="outline" disabled={isPending}>
                  Reject
                </Button>
                <Button type="submit" value="accepted" variant="primary" disabled={isPending}>
                  Accept
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingApplicationDetails;
