import { getUser } from "@/utils/users";
import { redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};
const useUser = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const getUserData = async () => {
      const user = await getUser();
      if (!user) redirect({ to: "/login" });

      setUser(user);
    };

    getUserData();
  }, []);

  return user;
};

export default useUser;
