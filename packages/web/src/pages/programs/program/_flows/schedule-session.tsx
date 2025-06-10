import TagsInput from "@/components/tags-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn, getRoundedTime } from "@/libs/utils";
import { useProgramParticipants } from "@/services/participant/participants";
import { useScheduleSession } from "@/services/program/schedule-session";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuCalendarPlus } from "react-icons/lu";
import { z } from "zod";

type Props = {
  programId: number;
  onClose?: () => void;
};

const scheduleSessionSchema = z.object({
  topic: z.string().max(200),
  agenda: z.string().max(2000),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  userIds: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .min(1, { message: "Please select at least one participant." }),
});

type FormValues = z.infer<typeof scheduleSessionSchema>;

const ScheduleSession = ({ programId, onClose }: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(scheduleSessionSchema),
    defaultValues: {
      topic: "",
      agenda: "",
      date: new Date(),
      startTime: getRoundedTime(),
      endTime: getRoundedTime(30),
      userIds: [],
    },
  });

  const { participants } = useProgramParticipants(programId);

  const { mutateAsync: scheduleSession, isPending } = useScheduleSession();

  const onSubmit = async (values: FormValues) => {
    try {
      await scheduleSession({
        data: {
          ...values,
          programId,
          userIds: values.userIds.map((x) => x.id),
        },
      });
      setOpen(false);
      onClose?.();
    } catch {
      //
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="flex-1">
          <LuCalendarPlus className="size-5" /> Schedule
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a session</DialogTitle>
          <DialogDescription>
            Schedule a mentoring session. Participants will receive the session details upon
            submission.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormDescription>A brief, clear title for this session</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agenda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agenda</FormLabel>
                  <FormControl>
                    <Textarea {...field} required />
                  </FormControl>
                  <FormDescription>
                    Describe the session's goals, talking points, or what attendees should expect.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <FormLabel>Date</FormLabel>

              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant={"outline"}
                              className={cn(
                                "text-left font-normal shadow-xs",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < startOfDay(new Date())}
                            captionLayout="dropdown"
                            weekStartsOn={1}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                <span className="text-neutral-700">from</span>

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex gap-0">
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          step="60000"
                          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <span className="text-neutral-700">to</span>

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex gap-0">
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          step="60000"
                          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormDescription>
                The day and time the session will take place. Only future dates are allowed.
              </FormDescription>
            </div>

            <FormField
              control={form.control}
              name="userIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participants</FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field.value || []}
                      onChange={field.onChange}
                      allTags={
                        participants?.active?.map((p) => ({
                          id: p.user.id,
                          name: p.user.name,
                        })) || []
                      }
                      placeholder="Type to add participants"
                    />
                  </FormControl>
                  <FormDescription>
                    List of invited mentees. Only users selected here will receive a session invite.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="primary" type="submit" disabled={isPending}>
                {isPending && <Spinner className="size-5 stroke-2 text-white" />}
                Done
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleSession;
