import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Link } from "@tanstack/react-router";

const Links = [
  { to: "/dashboard", label: "Tableau de bord", icon: <DashboardIcon /> },
  { to: "/transactions", label: "Transactions", icon: <ReceiptLongIcon /> },
  { to: "/accounts", label: "Mes Comptes", icon: <PeopleAltIcon /> },
  { to: "/transfer", label: "Virements", icon: <CompareArrowsIcon /> },
];

export default function NavLinks() {
  return (
    <div>
      {Links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex gap-2 items-center p-4 hover:bg-black/10"
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </div>
  );
}
