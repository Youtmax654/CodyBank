type LoginUserBody = {
  email: string;
  password: string;
};
export async function login(body: LoginUserBody) {
  const res = await fetch("/api/login", {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to login");
  }

  return res.json();
}

type RegisterUserBody = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
export async function register(body: RegisterUserBody) {
  const res = await fetch("/api/register", {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to register user");
  }

  return res.json();
}
