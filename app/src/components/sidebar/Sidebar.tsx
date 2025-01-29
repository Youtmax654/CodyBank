import { Divider } from "@mui/material";
import NavLinks from "./NavLinks";
import ProfileButton from "./ProfileButton";

export default function Sidebar() {
  return (
    <div className="flex flex-col bg-gray-200 min-w-60 h-full justify-between">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold flex items-center mt-4 ml-2">
          🏦 CodyBank
        </h1>
        <NavLinks />
      </div>
      <div>
        <Divider />
        <ProfileButton />
      </div>
    </div>
  );
}
