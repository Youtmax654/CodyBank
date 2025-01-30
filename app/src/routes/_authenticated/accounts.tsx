import Accounts from "@/components/account/accounts";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/accounts")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full overflow-y-auto">
      <Accounts />
    </div>
  );
}
