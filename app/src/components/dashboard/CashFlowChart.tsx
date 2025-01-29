import { chartOptions, FinancialData, months } from "@/utils/chartConfig";
import { Bar } from "react-chartjs-2";

export default function CashFlowChart({
  financialData,
}: {
  financialData: FinancialData[];
}) {
  const cashFlowData = {
    labels: months,
    datasets: [
      {
        label: "Recettes",
        data: financialData.map((d) => d.revenue),
        backgroundColor: "#10b981",
      },
      {
        label: "Dépenses",
        data: financialData.map((d) => d.expenses),
        backgroundColor: "#ef4444",
      },
      {
        label: "Solde",
        data: financialData.map((d) => d.balance),
        type: "line",
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f680",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">Flux de trésorerie annuel</h2>
      <div className="h-64">
        <Bar
          // @ts-expect-error: type mismatch
          data={cashFlowData}
          options={{
            ...chartOptions,
            scales: {
              x: { stacked: false },
              y: { beginAtZero: true },
            },
          }}
        />
      </div>
    </div>
  );
}
