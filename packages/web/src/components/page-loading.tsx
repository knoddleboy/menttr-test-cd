import { Spinner } from "@/components/ui/spinner";

const PageLoading = () => (
  <div className="h-full flex justify-center items-center">
    <div className="fixed">
      <Spinner />
    </div>
  </div>
);

export default PageLoading;
