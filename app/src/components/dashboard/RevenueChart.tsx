import { chartOptions, FinancialData, months } from "@/utils/chartConfig";
import { Line } from "react-chartjs-2";

export default function RevenueChart({
  financialData,
}: {
  financialData: FinancialData[];
}) {
  const revenueData = {
    labels: months,
    datasets: [
      {
        label: "Recettes (€)",
        data: financialData.map((d) => d.revenue),
        borderColor: "#10b981",
        backgroundColor: "#10b98180",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4">Entrées</h2>
      <div className="h-64">
        <Line data={revenueData} options={chartOptions} />
      </div>
    </div>
  );
}
