import RegisterForm from "@/components/register/RegisterForm";
import { Divider } from "@mui/material";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col justify-center gap-8 w-1/2 h-full">
      <h1 className="text-3xl font-bold w-1/2 mx-auto">Inscription</h1>
      <Divider variant="middle" className="w-1/2 self-center" />
      <RegisterForm />
      <Divider variant="middle" className="w-1/2 self-center" />
      <p className="w-1/2 mx-auto">
        Vous avez déjà un compte ?{" "}
        <Link to="/login" className="text-blue-500">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
