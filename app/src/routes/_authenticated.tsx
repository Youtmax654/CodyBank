import { isAuthenticated } from "@/utils/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: LayoutComponent,
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function LayoutComponent() {
  return (
    <div>
      Hello "/_authenticated"!
      <Outlet />
    </div>
  );
}
