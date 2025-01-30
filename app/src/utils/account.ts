import axios from "axios";
import Cookies from "js-cookie";

export type AccountType = "CHECKING" | "SAVINGS";

export async function getAccount() {
  const token = Cookies.get("token");
  if (!token) throw new Error("No token");

  const res = await axios.get("/api/accounts", {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

type AccountCreateBody = {
  name: string;
  type: AccountType;
};
export async function addAccount(body: AccountCreateBody) {
  const token = Cookies.get("token");
  if (!token) throw new Error("No token");

  const res = await axios.post("/api/accounts", body, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
}
