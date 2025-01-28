import useUser from "@/hooks/useUser";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUser();

  return (
    <div>
      Hello "/dashboard"!
      {user ? (
        <div>
          <p>First Name: {user.first_name}</p>
          <p>Last Name: {user.last_name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
