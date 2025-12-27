'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, TextField, Button, Stack, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import styles from './page.module.css';

export default function ConsultaPage() {
  const router = useRouter();
  const [patente, setPatente] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const patenteClean = patente.trim().toUpperCase().replace(/\s/g, '');
    
    if (!patenteClean) {
      setError('Por favor ingresa una patente');
      return;
    }

    if (patenteClean.length < 6 || patenteClean.length > 8) {
      setError('La patente debe tener entre 6 y 8 caracteres');
      return;
    }

    router.push(`/consulta/${patenteClean}`);
  };

  return (
    <Box className={styles.pageWrapper}>
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Consultar Patente
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ingresa la patente de tu motocicleta para ver el historial de servicios
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSearch}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Patente"
            placeholder="Ej: A160PXS"
            value={patente}
            onChange={(e) => {
              setPatente(e.target.value.toUpperCase());
              setError('');
            }}
            error={!!error}
            helperText={error || 'Ingresa la patente de tu motocicleta'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '1rem', sm: '1.125rem' },
                '& input': {
                  textTransform: 'uppercase',
                },
              },
            }}
            inputProps={{
              maxLength: 8,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 600,
            }}
          >
            Buscar
          </Button>
        </Stack>
      </Box>
      </Container>
    </Box>
  );
}

