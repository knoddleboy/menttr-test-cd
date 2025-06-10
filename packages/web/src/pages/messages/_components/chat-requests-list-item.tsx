import { HiEnvelopeOpen } from "react-icons/hi2";
import { Link } from "react-router";

type Props = {
  pendingRequestsCount: number;
};

const ChatRequestsListItem = ({ pendingRequestsCount }: Props) => {
  return (
    <Link
      to="/messages/requests"
      className="flex justify-between p-4 hover:bg-neutral-50 border-b border-neutral-200"
    >
      <div className="flex items-center gap-4">
        <HiEnvelopeOpen className="size-6 text-neutral-700" />

        <div>
          <div className="text-neutral-700 font-semibold leading-5">Requests</div>
          <div className="text-neutral-500 text-sm leading-5">
            {pendingRequestsCount} new request(s)
          </div>
        </div>
      </div>

      {/* <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full"></div> */}
    </Link>
  );
};

export default ChatRequestsListItem;
