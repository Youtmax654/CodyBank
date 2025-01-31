import UpdatePasswordForm from "@/components/settings/UpdatePasswordForm";
import UpdateProfileForm from "@/components/settings/UpdateProfileForm";
import { Card } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-8 p-4 w-full h-full">
      <h1 className="text-3xl font-bold">Paramètres</h1>
      <div className="flex flex-row gap-4 w-full">
        <Card className="flex flex-col gap-4 p-4 w-full">
          <h2 className="text-xl font-semibold mb-4">Mon profil</h2>
          <UpdateProfileForm />
        </Card>
        <Card className="flex flex-col gap-4 p-4 w-full">
          <h2 className="text-xl font-semibold mb-4">
            Changer le mot de passe
          </h2>
          <UpdatePasswordForm />
        </Card>
      </div>
    </div>
  );
}
