import { Outlet } from "react-router";
import Chat from "./chat/page";
import { useHeaderTitle } from "@/hooks/use-header-title";

const MessagesLayout = () => {
  useHeaderTitle("Messages");

  return (
    <main className="grid grid-cols-[320px_1fr] overflow-hidden">
      <section className="border-r border-neutral-200 bg-white z-1 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </section>

      <section className="flex flex-col justify-center overflow-x-hidden">
        <Chat />
      </section>
    </main>
  );
};

export default MessagesLayout;
