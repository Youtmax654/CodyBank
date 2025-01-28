import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../components/login/LoginForm";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-row h-full">
      <LoginForm />
      <div className="bg-slate-300 w-1/2"></div>
    </div>
  );
}
