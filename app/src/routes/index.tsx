import { isAuthenticated } from "@/utils/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (isAuthenticated()) {
      throw redirect({
        to: "/dashboard",
      });
    } else {
      throw redirect({
        to: "/login",
      });
    }
  },
});
