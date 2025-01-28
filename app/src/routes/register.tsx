import { createFileRoute } from "@tanstack/react-router";
import RegisterForm from "../components/register/RegisterForm";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-row h-full">
      <RegisterForm />
      <div className="bg-slate-300 w-1/2"></div>
    </div>
  );
}
