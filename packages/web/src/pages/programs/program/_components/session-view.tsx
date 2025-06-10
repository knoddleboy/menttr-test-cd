import GoBackButton from "@/components/go-back-button";
import axios from "@/libs/axios";
// import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import { useEffect, useRef } from "react";

type Props = {
  session: any;
};

const SessionView = ({ session }: Props) => {
  // const client = ZoomMtgEmbedded.createClient();
  const client = {} as any;

  const meetingRootRef = useRef<HTMLDivElement>(null);

  console.log(session);

  useEffect(() => {}, []);

  async function startMeeting(signature: string) {
    try {
      await client.init({
        zoomAppRoot: meetingRootRef.current!,
        language: "en-US",
        patchJsMedia: true,
        leaveOnPageUnload: true,
        customize: {
          video: {
            isResizable: false,
            popper: {
              disableDraggable: true,
            },
            viewSizes: {
              default: {
                width: 300,
                height: 200,
              },
            },
          },
        },
      });

      await client.join({
        signature: signature,
        sdkKey: "nZzcTaZXSBWX6sdSMvtEYQ",
        meetingNumber: session.meetingId,
        password: session.meetingPassword,
        userName: "user 123",
        userEmail: "",
        tk: "",
        zak: "",
      });
    } catch (error) {
      console.log(error);
    }
  }

  const getSignature = async () => {
    try {
      const response = await axios.post("/sessions/zoom/signature", {
        meetingNumber: session.meetingId,
        role: 1,
      });

      const signature = response.data.signature;
      console.log(response.data);

      startMeeting(signature);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="py-2 flex justify-between border-b border-neutral-200">
        <GoBackButton />
        <h1 className="flex items-center text-neutral-700 font-semibold">{session.topic}</h1>
        <div className="w-10" />
      </div>
      <div className="flex-1">
        <div ref={meetingRootRef} />
        <button onClick={getSignature}>Join Meeting</button>
      </div>
    </div>
  );
};

export default SessionView;
