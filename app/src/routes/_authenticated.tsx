import Sidebar from "@/components/sidebar/Sidebar";
import { isAuthenticated } from "@/utils/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppThemeProvider } from "@/contexts/ThemeContext";

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
    <AppThemeProvider>
      <div className="flex flex-row h-screen w-full overflow-hidden">
        <Sidebar />
        <Outlet />
      </div>
    </AppThemeProvider>
  );
}
