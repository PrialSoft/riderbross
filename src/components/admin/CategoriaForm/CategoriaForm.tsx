'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CustomButton from '@/utils/ui/button/CustomButton';
import { createCategoria, updateCategoria } from '@/app/admin/dashboard/categorias/actions';

export default function CategoriaForm(props: {
  mode: 'create' | 'edit';
  onSuccess?: () => void;
  initial?: {
    id: number;
    nombre: string;
  };
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(props.initial?.nombre ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => nombre.trim().length > 0 && !saving, [nombre, saving]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSaving(true);
      setError(null);

      const payload = {
        nombre: nombre.trim(),
      };

      if (props.mode === 'create') {
        await createCategoria(payload);
      } else {
        await updateCategoria(props.initial!.id, payload);
      }

      if (props.onSuccess) {
        props.onSuccess();
      } else {
        router.push('/admin/dashboard/categorias');
        router.refresh();
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err?.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        background:
          'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.15) 100%)',
        backdropFilter: 'blur(15px)',
        border: 'none',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-family-body)' }}
      >
        {props.mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value.toUpperCase())}
          required
          disabled={saving}
          fullWidth
          helperText="El nombre se guardará en mayúsculas"
        />

        <CustomButton
          type="submit"
          startIcon={saving ? undefined : <SaveIcon />}
          disabled={!canSubmit}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
        </CustomButton>
      </Box>
    </Paper>
  );
}

