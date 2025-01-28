import { isAuthenticated } from "@/utils/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
  beforeLoad: async () => {
    if (isAuthenticated()) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function LayoutComponent() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Outlet />
      <img
        src="/bank-bg.svg"
        alt="Background"
        className="object-cover w-1/2 h-full select-none"
        draggable={false}
      />
    </div>
  );
}
