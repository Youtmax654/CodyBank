import BalanceChart from "@/components/dashboard/BalanceChart";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import ExpensesChart from "@/components/dashboard/ExpensesChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [accountId, setAccountId] = useState(1);

  const handleChange = (event: SelectChangeEvent<number>) => {
    setAccountId(event.target.value as number);
  };

  return (
    <div className="flex flex-col h-screen p-4 gap-6 flex-1 overflow-y-auto">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <Select value={accountId} onChange={handleChange} className="w-fit">
        <MenuItem value={1}>Compte principal</MenuItem>
        <MenuItem value={2}>Compte secondaire</MenuItem>
      </Select>
      <div className="flex flex-row gap-6 w-full">
        <BalanceChart />
        <RevenueChart />
        <ExpensesChart />
      </div>
      <CashFlowChart />
    </div>
  );
}
