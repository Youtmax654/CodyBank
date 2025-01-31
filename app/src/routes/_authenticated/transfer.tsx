import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import useUser from '@/hooks/useUser';
import axiosInstance from '@/utils/axios';
import { Account } from '@/types/account';
import { Transaction } from '@/types/transaction';
import { Beneficiary } from '@/types/beneficiary';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import AddBeneficiaryModal from '@/components/beneficiaries/AddBeneficiaryModal';

export const Route = createFileRoute('/_authenticated/transfer')({
  component: TransferPage
});

function TransferPage() {
  const user = useUser();
  const navigate = useNavigate();
  const [transferType, setTransferType] = useState<'internal' | 'external' | 'beneficiary'>('internal');
  const [sourceAccountId, setSourceAccountId] = useState<string>('');
  const [destinationAccountId, setDestinationAccountId] = useState<string>('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [destinationIban, setDestinationIban] = useState<string>('');
  const [destinationName, setDestinationName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAddBeneficiaryModalOpen, setIsAddBeneficiaryModalOpen] = useState(false);

  // Récupérer les comptes de l'utilisateur
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery<Account[]>({
    queryKey: ['accounts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await axiosInstance.get("/accounts");
      return response.data;
    },
    enabled: !!user
  });

  // Récupérer les bénéficiaires de l'utilisateur
  const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useQuery<Beneficiary[]>({
    queryKey: ['beneficiaries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await axiosInstance.get("/beneficiaries");
      return response.data;
    },
    enabled: !!user
  });

  // Mutation pour supprimer un bénéficiaire
  const deleteBeneficiaryMutation = useMutation({
    mutationFn: async (beneficiaryId: string) => {
      const response = await axiosInstance.delete(`/beneficiaries/${beneficiaryId}`);
      return response.data;
    },
    onSuccess: () => {
      // Rafraîchir la liste des bénéficiaires
      // Le useQuery se chargera de mettre à jour automatiquement
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Erreur lors de la suppression du bénéficiaire';
      setError(errorMessage);
    }
  });

  // Mutation pour effectuer le virement
  const transferMutation = useMutation({
    mutationFn: async (transferData: {
      source_account_id: string, 
      destination_account_id?: string,
      iban?: string,
      name?: string,
      amount: number
    }) => {
      try {
        const response = await axiosInstance.post("/send", transferData);
        return response.data;
      } catch (error: any) {
        console.error('Transfer error:', error.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      setSuccess('Virement effectué avec succès !');
      setError(null);
      
      // Réinitialiser les champs
      setSourceAccountId('');
      setDestinationAccountId('');
      setSelectedBeneficiary(null);
      setDestinationIban('');
      setDestinationName('');
      setAmount('');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Erreur lors du virement';
      setError(errorMessage);
      setSuccess(null);
      console.error('Transfer mutation error:', error);
    }
  });

  const handleAddBeneficiary = () => {
    setIsAddBeneficiaryModalOpen(true);
  };

  const handleTransfer = () => {
    // Validation de base
    if (!sourceAccountId) {
      setError('Veuillez sélectionner un compte source');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError('Montant invalide');
      return;
    }

    // Trouver le compte source pour vérifier le solde
    const sourceAccount = accounts?.find(acc => acc.id === sourceAccountId);
    if (!sourceAccount) {
      setError('Compte source introuvable');
      return;
    }

    if (transferAmount > sourceAccount.balance) {
      setError(`Solde insuffisant. Votre solde actuel est de ${sourceAccount.balance.toFixed(2)} €`);
      return;
    }

    // Validation spécifique selon le type de destination
    switch (transferType) {
      case 'internal':
        if (!destinationAccountId) {
          setError('Veuillez sélectionner un compte destination');
          return;
        }
        break;
      case 'beneficiary':
        if (!selectedBeneficiary) {
          setError('Veuillez sélectionner un bénéficiaire');
          return;
        }
        break;
      case 'external':
        if (!destinationIban) {
          setError('Veuillez saisir un IBAN');
          return;
        }
        if (!destinationName) {
          setError('Veuillez saisir un nom de bénéficiaire');
          return;
        }
        break;
    }

    // Effectuer le virement
    transferMutation.mutate({
      source_account_id: sourceAccountId,
      destination_account_id: transferType === 'internal' ? destinationAccountId : 
                               transferType === 'beneficiary' ? selectedBeneficiary?.account_id : undefined,
      iban: transferType === 'external' ? destinationIban : undefined,
      name: transferType === 'external' ? destinationName : 
            transferType === 'beneficiary' ? selectedBeneficiary?.name : undefined,
      amount: transferAmount
    });
  };

  const handleDeleteBeneficiary = (beneficiaryId: string) => {
    deleteBeneficiaryMutation.mutate(beneficiaryId);
  };

  // Trouver le solde du compte source sélectionné
  const selectedSourceAccount = accounts?.find(acc => acc.id === sourceAccountId);

  if (isLoadingAccounts || isLoadingBeneficiaries) {
    return <Typography>Chargement...</Typography>;
  }

  if (!accounts || accounts.length === 0) {
    return <Typography>Aucun compte disponible</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          <CompareArrowsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Effectuer un virement
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type de virement</InputLabel>
                <Select
                  value={transferType}
                  label="Type de virement"
                  onChange={(e) => {
                    setTransferType(e.target.value as 'internal' | 'external' | 'beneficiary');
                    // Réinitialiser les champs
                    setDestinationAccountId('');
                    setSelectedBeneficiary(null);
                    setDestinationIban('');
                    setDestinationName('');
                  }}
                >
                  <MenuItem value="internal">Virement interne</MenuItem>
                  <MenuItem value="external">Virement externe (IBAN)</MenuItem>
                  <MenuItem value="beneficiary">Mes bénéficiaires</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Compte source</InputLabel>
                <Select
                  value={sourceAccountId}
                  label="Compte source"
                  onChange={(e) => setSourceAccountId(e.target.value)}
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name} - Solde: {account.balance.toFixed(2)} €
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedSourceAccount && (
                <Typography variant="body2" color="text.secondary">
                  Solde actuel : {selectedSourceAccount.balance.toFixed(2)} €
                </Typography>
              )}

              {transferType === 'internal' && (
                <FormControl fullWidth>
                  <InputLabel>Compte destination</InputLabel>
                  <Select
                    value={destinationAccountId}
                    label="Compte destination"
                    onChange={(e) => setDestinationAccountId(e.target.value)}
                  >
                    {accounts.map((account) => (
                      <MenuItem 
                        key={account.id} 
                        value={account.id} 
                        disabled={account.id === sourceAccountId}
                      >
                        {account.name} - Solde: {account.balance.toFixed(2)} €
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {transferType === 'external' && (
                <>
                  <TextField
                    fullWidth
                    label="IBAN"
                    value={destinationIban}
                    onChange={(e) => setDestinationIban(e.target.value)}
                    placeholder="FR76 1234 5678 9012 3456 7890 189"
                    helperText="Saisissez l'IBAN complet du bénéficiaire"
                  />
                  <TextField
                    fullWidth
                    label="Nom du bénéficiaire"
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    placeholder="Nom complet ou nom de l'entreprise"
                  />
                </>
              )}

              {transferType === 'beneficiary' && (
                <Box>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={handleAddBeneficiary}
                    sx={{ mb: 2 }}
                  >
                    Ajouter un bénéficiaire
                  </Button>
                  {beneficiaries && beneficiaries.length > 0 ? (
                    beneficiaries.map((beneficiary) => (
                      <Card 
                        key={beneficiary.id} 
                        sx={{ 
                          mb: 2, 
                          backgroundColor: selectedBeneficiary?.id === beneficiary.id 
                            ? 'primary.light' 
                            : 'background.paper' 
                        }}
                      >
                        <CardContent sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center' 
                        }}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {beneficiary.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Compte : {beneficiary.account_id}
                            </Typography>
                          </Box>
                          <Box>
                            <Tooltip title="Sélectionner ce bénéficiaire">
                              <Button 
                                variant="outlined" 
                                color="primary" 
                                size="small"
                                onClick={() => setSelectedBeneficiary(beneficiary)}
                                sx={{ mr: 1 }}
                              >
                                <SendIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Supprimer le bénéficiaire">
                              <IconButton 
                                color="error" 
                                size="small"
                                onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucun bénéficiaire enregistré
                    </Typography>
                  )}
                </Box>
              )}

              <TextField
                fullWidth
                label="Montant"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="body2">€</Typography>
                }}
                inputProps={{
                  min: 0,
                  step: 0.01
                }}
              />

              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleTransfer}
                fullWidth
                disabled={
                  transferMutation.isLoading || 
                  !sourceAccountId || 
                  !amount || 
                  parseFloat(amount) <= 0 ||
                  (transferType === 'internal' && !destinationAccountId) ||
                  (transferType === 'external' && (!destinationIban || !destinationName)) ||
                  (transferType === 'beneficiary' && !selectedBeneficiary) ||
                  (selectedSourceAccount && parseFloat(amount) > selectedSourceAccount.balance)
                }
              >
                {transferMutation.isLoading ? 'Virement en cours...' : 'Effectuer le virement'}
              </Button>
            </Box>
          </Grid>

          {/* Section des bénéficiaires */}
          {transferType === 'beneficiary' && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Mes bénéficiaires
              </Typography>
              {beneficiaries && beneficiaries.length > 0 ? (
                beneficiaries.map((beneficiary) => (
                  <Card key={beneficiary.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body1" fontWeight="bold">
                        {beneficiary.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Compte : {beneficiary.account_id}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucun bénéficiaire enregistré
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Modal d'ajout de bénéficiaire */}
      <AddBeneficiaryModal 
        open={isAddBeneficiaryModalOpen}
        onClose={() => setIsAddBeneficiaryModalOpen(false)}
      />
    </Container>
  );
}
