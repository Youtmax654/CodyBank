import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
} from "@mui/material";
import { Transaction } from "@/types/transaction";
import { Account } from "@/types/account";
import useUser from "@/hooks/useUser";
import axiosInstance from "@/utils/axios";
import axios from 'axios';

interface TransactionListProps {
  accounts: Account[];
}

export default function TransactionList({ accounts }: TransactionListProps) {
  const user = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id || "");
  const [transactionType, setTransactionType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user || !selectedAccount) {
      console.log("No user or account found, skipping fetch");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching transactions for account:", selectedAccount);
      
      // Utiliser le endpoint pour un compte spécifique
      const response = await axiosInstance.get("/transactions", {
        params: { account_id: selectedAccount }
      });
      
      console.log("API Response:", {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
      
      const transactionsArray = Array.isArray(response.data) ? response.data : [];
      console.log("Parsed transactions:", transactionsArray);
      setTransactions(transactionsArray);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || "Erreur lors de la récupération des transactions";
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
        setError(errorMessage);
      } else {
        setError("Erreur lors de la récupération des transactions");
      }
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, user]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    console.log("Changing selected account to:", newValue);
    setSelectedAccount(newValue);
  };

  const handleTransactionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTransactionType(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by transaction type
    if (transactionType !== "all") {
      if (transactionType === "recettes" && transaction.source_account_id) {
        return false;
      }
      if (transactionType === "depenses" && !transaction.source_account_id) {
        return false;
      }
    }

    // Filter by search query (amount)
    if (searchQuery) {
      const amount = transaction.amount.toString();
      return amount.includes(searchQuery);
    }

    return true;
  });

  const getTransactionColor = (transaction: Transaction) => {
    if (!transaction.source_account_id) return "success"; // Recette
    return "error"; // Dépense
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || accountId;
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Compte</InputLabel>
          <Select value={selectedAccount} onChange={handleAccountChange} label="Compte">
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name || account.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Type de transaction</InputLabel>
          <Select
            value={transactionType}
            onChange={handleTransactionTypeChange}
            label="Type de transaction"
          >
            <MenuItem value="all">Toutes les transactions</MenuItem>
            <MenuItem value="recettes">Recettes</MenuItem>
            <MenuItem value="depenses">Dépenses</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Rechercher par montant"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {loading && (
        <Typography variant="body1" color="text.secondary" align="center">
          Chargement des transactions...
        </Typography>
      )}

      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        {!loading && !error && filteredTransactions.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            Aucune transaction trouvée
          </Typography>
        )}

        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">
                    {transaction.amount.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {formatDate(transaction.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography>
                    {transaction.source_account_id
                      ? `Envoyé depuis ${getAccountName(transaction.source_account_id)}`
                      : `Reçu sur ${getAccountName(transaction.destination_account_id!)}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Chip
                    label={transaction.source_account_id ? "Dépense" : "Recette"}
                    color={getTransactionColor(transaction)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
