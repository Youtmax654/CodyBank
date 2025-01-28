import LoginForm from "@/components/login/LoginForm";
import { Divider } from "@mui/material";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col justify-center gap-8 w-1/2 h-full">
      <h1 className="text-3xl font-bold w-1/2 mx-auto">Connexion</h1>
      <Divider variant="middle" className="w-1/2 self-center" />
      <LoginForm />
      <Divider variant="middle" className="w-1/2 self-center" />
      <p className="w-1/2 mx-auto">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-blue-500">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
