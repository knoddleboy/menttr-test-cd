import { useRef, useState } from "react";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import axios from "@/libs/axios";

const client = ZoomMtgEmbedded.createClient();

const ZoomMeeting = () => {
  const [inMeeting, setInMeeting] = useState(false);
  const zoomRootRef = useRef<HTMLDivElement>(null);

  const getSignature = async (meetingNumber: string, isHost: boolean) => {
    const response = await axios.post("/generate-signature", { meetingNumber, isHost });
    return response.data;
  };

  const join = async (
    meetingNumber: string,
    userName: string,
    userEmail: string,
    password: string,
    isHost: boolean
  ) => {
    const { signature, zak } = await getSignature(meetingNumber, isHost);
    if (!zoomRootRef.current) return;

    await client.init({
      zoomAppRoot: zoomRootRef.current,
      language: "en-US",
      patchJsMedia: true,
    });

    await client.join({
      sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY!,
      signature,
      meetingNumber,
      password,
      userName,
      userEmail,
      zak: isHost ? zak : undefined,
    });

    client.on("connection-change", (payload) => {
      if (payload.state === "Closed") setInMeeting(false);
    });

    setInMeeting(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {!inMeeting && (
        <>
          <button
            className="btn-blue"
            onClick={() => join("MEETING_ID", "Mentor", "mentor@example.com", "PASS", true)}
          >
            Start Meeting (Mentor)
          </button>
          <button
            className="btn-green"
            onClick={() => join("MEETING_ID", "Participant", "user@example.com", "PASS", false)}
          >
            Join Meeting (Participant)
          </button>
        </>
      )}
      <div ref={zoomRootRef} id="meetingSDKElement" className="w-full h-full" />
    </div>
  );
};

export default ZoomMeeting;
