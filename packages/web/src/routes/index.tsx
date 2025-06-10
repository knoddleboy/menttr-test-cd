import AuthLayout from "@/pages/auth/layout";
import Login from "@/pages/auth/login/page";
import Signup from "@/pages/auth/signup/page";
import Discussions from "@/pages/discussions/page";
import Programs from "@/pages/programs/page";
import MainLayout from "@/pages/layout";
import MessagesLayout from "@/pages/messages/layout";
import Profile from "@/pages/profile/page";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router";
import GuestGuard from "./guards/guest";
import AdminPanel from "@/pages/admin/page";
import { AuthGuard } from "./guards/auth";
import AdminPanelLayout from "@/pages/admin/layout";
import EditProfile from "@/pages/profile/edit/page";
import CreateProgram from "@/pages/programs/new/page";
import ProgramView from "@/pages/programs/program/page";
import EditProgram from "@/pages/programs/edit/page";
import ChatListView from "@/pages/messages/_components/chat-list-view";
import ChatRequestsListView from "@/pages/messages/_components/chat-requests-list-view";

export const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<GuestGuard />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Programs />} />

          <Route path="/messages" element={<MessagesLayout />}>
            <Route index element={<ChatListView />} />
            <Route path=":convId" element={<ChatListView />} />
            <Route path="requests" element={<ChatRequestsListView />} />
            <Route path="requests/:convId" element={<ChatRequestsListView />} />
          </Route>

          <Route path="/discussions" element={<Discussions />} />

          <Route path="/profile/edit" element={<EditProfile />} />

          <Route path="/:username" element={<Profile />}>
            {/* <Route index element={<ProfileIndex />} />

            <Route element={<AuthGuard />}>
              <Route path="my-programs" element={<MyPrograms />} />
              <Route path="joined-programs" element={<JoinedPrograms />} />
            </Route>

            <Route path="programs" element={<ProgramsList />} /> */}
          </Route>

          <Route path="/:username/programs/new" element={<CreateProgram />} />
          <Route path="/:username/programs/:programId" element={<ProgramView />} />
          <Route path="/:username/programs/:programId/edit" element={<EditProgram />} />
        </Route>

        <Route element={<AuthGuard role="admin" />}>
          <Route path="/admin" element={<AdminPanelLayout />}>
            <Route index element={<AdminPanel />} />
          </Route>
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
};
