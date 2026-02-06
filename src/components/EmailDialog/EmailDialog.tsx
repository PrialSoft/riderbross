'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CustomButton from '@/utils/ui/button/CustomButton';
import styles from './EmailDialog.module.css';

interface EmailDialogProps {
  open: boolean;
  onClose: () => void;
  servicioId: number;
  patente: string;
  clienteNombre?: string | null;
  clienteEmail?: string | null;
}

export function EmailDialog({
  open,
  onClose,
  servicioId,
  patente,
  clienteNombre,
  clienteEmail,
}: EmailDialogProps) {
  const [emails, setEmails] = useState<string[]>(() => {
    // Inicializar con el email del cliente si existe
    return clienteEmail && clienteEmail.trim() ? [clienteEmail.trim()] : [];
  });
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddEmail = () => {
    const trimmed = currentEmail.trim();
    if (!trimmed) return;

    if (!emailRegex.test(trimmed)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (emails.includes(trimmed)) {
      setError('Este email ya está en la lista');
      return;
    }

    setEmails([...emails, trimmed]);
    setCurrentEmail('');
    setError(null);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSend = async () => {
    if (emails.length === 0) {
      setError('Debes agregar al menos un email');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/send-service-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          servicioId,
          emails,
          patente,
          clienteNombre,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al enviar el email');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setEmails(clienteEmail && clienteEmail.trim() ? [clienteEmail.trim()] : []);
        setCurrentEmail('');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al enviar el email';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmails(clienteEmail && clienteEmail.trim() ? [clienteEmail.trim()] : []);
      setCurrentEmail('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: { xs: 2, md: 3 },
          background:
            'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.15) 100%)',
          backdropFilter: 'blur(15px)',
          border: 'none',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          mb: 2,
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-family-body)',
        }}
      >
        Enviar Informe por Email
      </DialogTitle>
      <DialogContent sx={{ p: 0, mb: 2 }}>
        <Stack spacing={2}>
          {success && (
            <Alert severity="success">
              ¡Email enviado exitosamente!
            </Alert>
          )}

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Ingresa los emails a los que deseas enviar el informe técnico del servicio.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              type="email"
              placeholder="ejemplo@email.com"
              value={currentEmail}
              onChange={(e) => {
                setCurrentEmail(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleAddEmail}
              disabled={loading || !currentEmail.trim()}
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: 'var(--accent-primary)',
                '&:hover': {
                  backgroundColor: 'var(--accent-hover)',
                },
              }}
            >
              Agregar
            </Button>
          </Box>

          {emails.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                Emails a enviar:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {emails.map((email) => (
                  <Chip
                    key={email}
                    label={email}
                    onDelete={() => handleRemoveEmail(email)}
                    deleteIcon={<CloseIcon />}
                    disabled={loading}
                    sx={{
                      backgroundColor: 'rgba(139, 26, 26, 0.2)',
                      color: 'var(--text-primary)',
                      '& .MuiChip-deleteIcon': {
                        color: 'var(--text-secondary)',
                        '&:hover': {
                          color: 'var(--text-primary)',
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 0, mt: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ color: 'var(--text-secondary)' }}
        >
          Cancelar
        </Button>
        <CustomButton
          variant="contained"
          onClick={handleSend}
          disabled={loading || emails.length === 0}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {loading ? 'Enviando...' : 'Enviar Email'}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}

