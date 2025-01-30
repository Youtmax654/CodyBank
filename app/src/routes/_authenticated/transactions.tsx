import { createFileRoute } from "@tanstack/react-router";
import { Typography, Container, Paper } from "@mui/material";
import TransactionList from "@/components/transactions/TransactionList";
import { useQuery } from "@tanstack/react-query";
import { Account } from "@/types/account";
import axiosInstance from "@/utils/axios";
import useUser from "@/hooks/useUser";

export const Route = createFileRoute("/_authenticated/transactions")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUser();
  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["accounts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await axiosInstance.get("/accounts", {
        params: {
          user_id: user.id
        }
      });
      return response.data;
    },
    enabled: !!user,
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mes transactions
      </Typography>
      
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        {accounts && <TransactionList accounts={accounts} />}
      </Paper>
    </Container>
  );
}
