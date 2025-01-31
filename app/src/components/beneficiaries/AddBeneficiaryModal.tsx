import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axios';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface AddBeneficiaryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddBeneficiaryModal({ open, onClose }: AddBeneficiaryModalProps) {
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const addBeneficiaryMutation = useMutation({
    mutationFn: async (data: { name: string; iban: string }) => {
      const response = await axiosInstance.post("/beneficiaries", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalider et recharger la liste des bénéficiaires
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
      
      // Réinitialiser les champs et fermer la modal
      setName('');
      setIban('');
      setError(null);
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Erreur lors de l\'ajout du bénéficiaire';
      setError(errorMessage);
    }
  });

  const handleAddBeneficiary = () => {
    // Validation de base
    if (!name.trim()) {
      setError('Veuillez saisir un nom de bénéficiaire');
      return;
    }

    // Validation IBAN (format simplifié)
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{4,}$/;
    if (!iban.trim() || !ibanRegex.test(iban.replace(/\s/g, ''))) {
      setError('Veuillez saisir un IBAN valide');
      return;
    }

    // Supprimer les espaces de l'IBAN
    const cleanedIban = iban.replace(/\s/g, '');

    // Appeler la mutation
    addBeneficiaryMutation.mutate({
      name: name.trim(),
      iban: cleanedIban
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PersonAddIcon />
          <Typography variant="h6">Ajouter un bénéficiaire</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          label="Nom du bénéficiaire"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom complet ou nom de l'entreprise"
        />

        <TextField
          margin="dense"
          label="IBAN"
          fullWidth
          variant="outlined"
          value={iban}
          onChange={(e) => setIban(e.target.value)}
          placeholder="FR76 1234 5678 9012 3456 7890 189"
          helperText="Saisissez l'IBAN complet du bénéficiaire"
        />
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose} 
          color="secondary"
          variant="outlined"
        >
          Annuler
        </Button>
        <Button 
          onClick={handleAddBeneficiary} 
          color="primary"
          variant="contained"
          disabled={addBeneficiaryMutation.isLoading}
        >
          {addBeneficiaryMutation.isLoading ? 'Ajout en cours...' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
