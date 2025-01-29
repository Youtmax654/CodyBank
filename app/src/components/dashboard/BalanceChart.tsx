import { chartOptions, FinancialData, months } from "@/utils/chartConfig";
import { Line } from "react-chartjs-2";

export default function BalanceChart({
  financialData,
}: {
  financialData: FinancialData[];
}) {
  const balanceData = {
    labels: months,
    datasets: [
      {
        label: "Solde total (€)",
        data: financialData.map((d) => d.balance),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f680",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4">Solde</h2>
      <div className="h-64">
        <Line data={balanceData} options={chartOptions} />
      </div>
    </div>
  );
}
