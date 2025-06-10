import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  application: any;
};

const ProcessedApplicationDetails = ({ application }: Props) => {
  const user = application.user;

  return (
    <Dialog>
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

          <h3 className="items-center gap-2 text-neutral-700 font-medium">Decision</h3>
          <div className="overflow-hidden">
            <Textarea value={application.reason} disabled />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessedApplicationDetails;
