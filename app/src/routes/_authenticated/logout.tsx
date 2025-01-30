import { createFileRoute, redirect } from "@tanstack/react-router";
import Cookies from "js-cookie";

export const Route = createFileRoute("/_authenticated/logout")({
  beforeLoad: () => {
    Cookies.remove("token");
    throw redirect({
      to: "/login",
    });
  },
});
