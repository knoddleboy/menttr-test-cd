import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsEmpty, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMentorApplications } from "@/services/admin";
import MentorApplicationEntry from "./_components/mentor-application-entry";

const AdminPanel = () => {
  const { applications, isPending, refetch } = useMentorApplications();

  if (isPending) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="fixed">
          <Spinner />
        </div>
      </div>
    );
  }

  const pendingApplications = applications.filter((x) => x.status === "pending");
  const processedApplications = applications.filter((x) => x.status !== "pending");

  return (
    <div className="max-w-2xl mx-auto py-10 h-full">
      <Tabs defaultValue="pendingApplications" className="h-full">
        <TabsList>
          <TabsTrigger value="pendingApplications">
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="processedApplications">
            Processed ({processedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendingApplications">
          {pendingApplications.length ? (
            <div className="space-y-2">
              {pendingApplications.map((application) => (
                <MentorApplicationEntry
                  key={application.id}
                  entryKind="pending"
                  application={application}
                  onDecisionSuccess={refetch}
                />
              ))}
            </div>
          ) : (
            <div className="my-10 space-y-1 text-center">
              <div className="text-[15px] text-neutral-700 font-semibold">
                No pending applications at the moment.
              </div>
              <div className="text-sm text-neutral-500">Check back later for new submissions.</div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="processedApplications">
          {processedApplications.length ? (
            <div className="space-y-2">
              {processedApplications.map((application) => (
                <MentorApplicationEntry
                  key={application.id}
                  entryKind="processed"
                  application={application}
                  onDecisionSuccess={refetch}
                />
              ))}
            </div>
          ) : (
            <TabsEmpty
              title="There are no processed applications yet."
              subtitle="They will appear here once reviewed."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
