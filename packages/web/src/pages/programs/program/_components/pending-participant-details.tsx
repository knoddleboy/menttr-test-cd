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
import { useUpdateParticipantStatus } from "@/services/participant/update-participant-status";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  participant: any;
  onDecisionSuccess?: () => void;
};

const formSchema = z.object({
  reason: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PendingParticipantDetails = ({ participant, onDecisionSuccess }: Props) => {
  const [open, setOpen] = useState(false);

  const { updateParticipantStatus, isPending } = useUpdateParticipantStatus();

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
      await updateParticipantStatus({
        id: participant.id,
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
          <DialogTitle>{participant.user.name}'s application</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2">
          <h3 className="items-center gap-2 text-neutral-700 font-medium">Motivation</h3>
          <div className="overflow-hidden">
            <p className="text-neutral-500 text-sm leading-5">{participant.motivation}</p>
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
                      <Textarea {...field} />
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

export default PendingParticipantDetails;
