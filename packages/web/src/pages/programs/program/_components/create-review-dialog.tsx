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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RatingStars from "./rating-start";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/services/reviews/create-review";

type Props = {
  programId: number;
  onSubmit?: () => void;
};

const createReviewSchema = z.object({
  rating: z.number().min(0).max(5).step(1),
  content: z.string(),
});

type FormValues = z.infer<typeof createReviewSchema>;

const CreateReviewDialog = ({ programId, onSubmit: _onSubmit }: Props) => {
  const [open, setOpen] = useState(false);

  const { createReview, isPending } = useCreateReview();

  const form = useForm<FormValues>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 0,
      content: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createReview({
        programId,
        dto: values,
      });
      setOpen(false);
      _onSubmit?.();
    } catch {
      //
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="w-fit">
          Write a review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>Share your thoughts about the mentoring program.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How would you rate this mentoring program?</FormLabel>
                  <FormControl>
                    <RatingStars
                      initialRating={field.value}
                      onRate={(rating) => form.setValue("rating", rating)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your experience with the program.</FormLabel>
                  <FormControl>
                    <Textarea {...field} required />
                  </FormControl>
                  <FormDescription>
                    Mention what went well, what could be improved, or any key takeaways.
                  </FormDescription>
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="primary" type="submit" disabled={isPending}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReviewDialog;
