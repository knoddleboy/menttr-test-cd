import GoBackButton from "@/components/go-back-button";
import PageLoading from "@/components/page-loading";
import ProgramStatus from "@/components/program/program-status";
import ProgramType from "@/components/program/program-type";
import Tags from "@/components/tags";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsEmpty, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/user-avatar";
import { useHeaderTitle } from "@/hooks/use-header-title";
import { capitalize, cn } from "@/libs/utils";
import { useProgramParticipants } from "@/services/participant/participants";
import { useProgram } from "@/services/program/program";
import { useStartProgram } from "@/services/program/start-program";
import { useUser } from "@/services/user";
import { format } from "date-fns";
import { LuCalendarArrowDown, LuCalendarArrowUp } from "react-icons/lu";
import { Link, useParams } from "react-router";
import ApplyForProgramFlow from "./_flows/apply-program-flow";
import ProgramParticipantEntry from "./_components/program-participant-entry";
import { Calendar } from "@/components/ui/calendar";
import CircleProgress from "@/components/circle-progress";
import ReviewsTabContent from "./_components/reviews-tab-content";
import ProgramChatView from "./_components/program-chat-view";
import { IoChevronDownOutline, IoLanguage } from "react-icons/io5";
import Agenda from "./_components/agenda";
import { useEffect, useState } from "react";
import ScheduleSession from "./_flows/schedule-session";
import { useUserSessions } from "@/services/program/get-user-sessions";
import SessionListItem from "./_components/session-list-item";
import ProgramSessionList from "./_components/program-session-list";
import SessionView from "./_components/session-view";

const TabKeys = {
  // Primary
  Details: "details",
  Progress: "progress",
  Participants: "participants",
  Reviews: "reviews",
  // Secondary
  Participants__Active: "participants/active",
  Participants__Pending: "participants/pending",
};

const ProgramView = () => {
  const { programId } = useParams();

  const { user, isPending: isUserPending } = useUser();
  const { program, isPending: isProgramPending } = useProgram(+programId!);
  const {
    participants,
    isPending: isParticipantsPending,
    refetch: refetchParticipants,
  } = useProgramParticipants(+programId!);
  const { startProgram } = useStartProgram();

  const { data: userSessions, refetch: refetchSessions } = useUserSessions();

  useHeaderTitle(program?.title);

  const owner = program?.owner;
  const isParticipant = participants?.active?.some((x) => x.user.id === user?.id);
  const isOwnProgram = owner?.id === user?.id;

  const [date, setDate] = useState<Date>();
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(true);

  useEffect(() => {
    if (!isParticipant && !isOwnProgram) setAgendaOpen(true);
  }, [isParticipant, isOwnProgram]);

  if (isUserPending || isProgramPending || isParticipantsPending) {
    return <PageLoading />;
  }

  if (!program) {
    return (
      <main>
        <div className="max-w-2xl mx-auto py-10">
          <span className="text-neutral-800 text-2xl font-bold">This program doesn't exist.</span>
        </div>
      </main>
    );
  }

  const handleStartProgram = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to start this program?\n\nOnce started, it won't be visible on the Programs page or in search results."
    );
    if (!confirmed) return;

    try {
      await startProgram(program.id);
    } catch {
      //
    }
  };

  const isEnrollment = program.status === "enrollment";
  const isArchived = program.status === "completed";
  const isFull = program.activeParticipants === program?.maxParticipants;

  return (
    <main className="overflow-hidden">
      <header>
        <div className="fixed w-[calc(100vw-72px)] px-4 py-3 flex justify-between items-center gap-2 border-b border-neutral-200 bg-white/80 backdrop-blur-md z-1">
          <GoBackButton />
          <div className="flex gap-2">
            {!isOwnProgram && isEnrollment && !isParticipant && !isFull && (
              <ApplyForProgramFlow programId={program.id} isLoggedIn={!!user} />
            )}

            {isOwnProgram && !isArchived && (
              <Button variant="secondary" asChild>
                <Link to="edit">Edit</Link>
              </Button>
            )}

            {isOwnProgram && isEnrollment && (
              <Button variant="primary" onClick={handleStartProgram}>
                Start program
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="h-full overflow-hidden pt-[65px] bg-neutral-100">
        <div className="h-full grid grid-cols-[2fr_1fr] gap-3 p-3">
          <Tabs
            defaultValue={TabKeys.Details}
            className="h-full flex-1 gap-0 bg-white p-4 pt-1 rounded-lg shadow-lg"
          >
            <TabsList>
              <TabsTrigger value={TabKeys.Details}>Details</TabsTrigger>

              {(isOwnProgram || isParticipant) && (
                <TabsTrigger value={TabKeys.Progress}>Progress</TabsTrigger>
              )}

              <TabsTrigger
                value={TabKeys.Participants}
                disabled={!(isOwnProgram || isParticipant)}
                className="group"
              >
                <div className="relative">
                  Participants
                  {isOwnProgram && (participants?.pendingCount ?? 0) > 0 && (
                    <div className="absolute w-[5px] h-[5px] top-0.5 -right-2 bg-blue-400 group-hover:bg-blue-500 group-data-[state=active]:bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </TabsTrigger>

              {isArchived && <TabsTrigger value={TabKeys.Reviews}>Reviews</TabsTrigger>}
            </TabsList>

            <TabsContent value={TabKeys.Details} className="space-y-6">
              <div className="flex justify-between items-center gap-4 border-b border-neutral-200 py-4">
                <div className="flex items-center gap-3.5">
                  <Link to={`/${owner.username}`} className="hover:opacity-85 rounded-full">
                    <UserAvatar
                      name={owner.name}
                      avatar={owner.profileImageUrl}
                      className="size-15 text-2xl"
                    />
                  </Link>

                  <div>
                    <h3 className="text-neutral-800 font-bold text-lg leading-5">{owner.name}</h3>
                    <Link
                      to={`/${owner.username}`}
                      className="text-neutral-500 font-normal text-sm leading-5 hover:underline"
                    >
                      @{owner.username}
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_90px] text-sm text-neutral-700">
                  <div>Created:</div>
                  <time dateTime={program.createdAt} className="justify-self-end">
                    {format(program.createdAt, "MMM d, yyyy")}
                  </time>
                  {isArchived && (
                    <>
                      <div>Archived:</div>
                      <time dateTime={program.updatedAt} className="justify-self-end">
                        {format(program.updatedAt, "MMM d, yyyy")}
                      </time>
                    </>
                  )}
                  <div>Status:</div>
                  <ProgramStatus
                    status={program.status}
                    className="gap-1.5 text-sm justify-self-end"
                  />
                </div>
              </div>

              <div className="flex gap-x-8 gap-y-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <ProgramType type={program.type} withLabel={false} />
                  <div>
                    <div className="text-xs font-medium text-neutral-500 leading-3.5">Type</div>
                    <div className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                      {capitalize(program.type)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <LuCalendarArrowUp className="text-neutral-700 size-5" />
                  <div>
                    <div className="text-xs font-medium text-neutral-500 leading-3.5">
                      Start date
                    </div>
                    <div className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                      <time dateTime={program.startDate}>
                        {format(program.startDate, "MMM d, yyyy")}
                      </time>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <LuCalendarArrowDown className="text-neutral-700 size-5" />
                  <div>
                    <div className="text-xs font-medium text-neutral-500 leading-3.5">End date</div>
                    <div className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                      {program.endDate ? (
                        <time dateTime={program.startDate}>
                          {format(program.endDate, "MMM d, yyyy")}
                        </time>
                      ) : (
                        "Not specified"
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <IoLanguage className="text-neutral-700 size-5" />
                  <div>
                    <div className="text-xs font-medium text-neutral-500 leading-3.5">
                      Languages
                    </div>
                    <div className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                      {program.endDate ? (
                        <time dateTime={program.startDate}>
                          {format(program.endDate, "MMM d, yyyy")}
                        </time>
                      ) : (
                        "English"
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <CircleProgress
                    current={program.activeParticipants}
                    max={program.maxParticipants}
                    size={20}
                    strokeWidth={3}
                  />
                  <div>
                    <div className="text-xs font-medium text-neutral-500 leading-3.5">
                      Participants
                    </div>
                    <div className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                      <span title="Active participants" className="hover:underline">
                        {program.activeParticipants}
                      </span>
                      &nbsp;/&nbsp;
                      <span title="Max participants" className="hover:underline">
                        {program.maxParticipants}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-md text-neutral-700 font-semibold">About</h3>
                <p className="text-[15px] text-neutral-700 leading-5 whitespace-pre-line">
                  {program.description}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-md text-neutral-700 font-semibold">Areas of focus</h3>
                <Tags tags={program.skills} />
              </div>

              {isArchived && <Button variant="primary">Add review</Button>}
            </TabsContent>

            <TabsContent value={TabKeys.Progress}>
              {/* {isEnrollment ? (
                <TabsEmpty
                  title="Program hasn't started yet."
                  subtitle="Once it starts, you'll see your progress here."
                />
              ) : (
                // <SessionView session={userSessions[0]} />
                <ProgramSessionList programId={+programId!} />
              )} */}
              {/* <SessionView session={userSessions[0]} /> */}
              <ProgramSessionList programId={+programId!} />
            </TabsContent>

            <TabsContent value={TabKeys.Participants}>
              <Tabs defaultValue={TabKeys.Participants__Active}>
                <TabsList>
                  <TabsTrigger value={TabKeys.Participants__Active}>
                    Active ({participants?.activeCount})
                  </TabsTrigger>

                  {isOwnProgram && (
                    <TabsTrigger value={TabKeys.Participants__Pending} disabled={isArchived}>
                      Pending ({participants?.pendingCount})
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value={TabKeys.Participants__Active}>
                  {participants?.activeCount ? (
                    <div className="divide-y divide-neutral-200">
                      {participants?.active?.map((participant) => (
                        <ProgramParticipantEntry
                          key={participant.id}
                          participant={participant}
                          entryKind="active"
                        />
                      ))}
                    </div>
                  ) : (
                    <TabsEmpty
                      title="There are no participants in this program yet."
                      subtitle="Once you accept an applicant, they will appear here."
                    />
                  )}
                </TabsContent>

                <TabsContent value={TabKeys.Participants__Pending}>
                  {participants?.pendingCount ? (
                    <div className="divide-y divide-neutral-200">
                      {participants?.pending?.map((participant) => (
                        <ProgramParticipantEntry
                          key={participant.id}
                          participant={participant}
                          entryKind="pending"
                          onDecisionSuccess={refetchParticipants}
                        />
                      ))}
                    </div>
                  ) : (
                    <TabsEmpty
                      title="There are no pending applications at the moment."
                      subtitle="When someone applies to join this program, their application will appear here for your review."
                    />
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value={TabKeys.Reviews}>
              <ReviewsTabContent programId={+programId!} />
            </TabsContent>
          </Tabs>

          <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-x-hidden">
            <div className="flex gap-4 px-4 py-3 border-b border-neutral-200 overflow-hidden">
              <div className={cn("flex-1 flex flex-col", user && "gap-2")}>
                {calendarOpen && (
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0 h-fit"
                    weekStartsOn={1}
                  />
                )}

                <div className="flex justify-between gap-2">
                  {isOwnProgram && (
                    <ScheduleSession programId={+programId!} onClose={refetchSessions} />
                  )}
                  {user && (
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setAgendaOpen((prev) => !prev)}
                    >
                      <IoChevronDownOutline className={cn("size-5", agendaOpen && "rotate-180")} />{" "}
                      Agenda
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {user ? (
              <>
                {(isParticipant || isOwnProgram) && !agendaOpen && (
                  <ProgramChatView
                    chatId={program.chatId}
                    isExpanded={!calendarOpen}
                    onExpandClick={() => setCalendarOpen((prev) => !prev)}
                  />
                )}

                {agendaOpen && <Agenda startDate={date ?? new Date()} events={userSessions} />}
              </>
            ) : (
              <div className="flex-1 flex justify-center items-center text-neutral-500 text-[13px] font-medium">
                Log in to view agenda
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProgramView;
