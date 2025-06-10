import { useUserSessions } from "@/services/program/get-user-sessions";
import SessionListItem from "./session-list-item";

type Props = {
  programId: number;
};

const ProgramSessionList = ({ programId }: Props) => {
  const { data: sessions } = useUserSessions();

  const futureSessions = sessions.filter(
    (session) => !session.completed && session.program.id == programId
  );
  const pastSessions = sessions.filter(
    (session) => session.completed && session.program.id == programId
  );

  return (
    <div className="py-4 space-y-6">
      <div>
        <h3 className="text-md text-neutral-700 font-semibold">Future sessions</h3>
        {futureSessions.length ? (
          <ul className="divide-y divide-neutral-200">
            {futureSessions.map((session) => (
              <SessionListItem key={session.id} session={session} />
            ))}
          </ul>
        ) : (
          <div className="text-neutral-500 text-[15px]">No future sessions</div>
        )}
      </div>

      <div>
        <h3 className="text-md text-neutral-700 font-semibold">Past sessions</h3>
        {pastSessions.length ? (
          <ul>
            {pastSessions.map((session) => (
              <SessionListItem key={session.id} session={session} />
            ))}
          </ul>
        ) : (
          <div className="text-neutral-500 text-[15px]">No past sessions</div>
        )}
      </div>
    </div>
  );
};

export default ProgramSessionList;
