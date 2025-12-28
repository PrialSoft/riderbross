'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { supabase } from '@/lib/supabase/client';
import { createTipoServicio, updateTipoServicio } from '@/app/admin/dashboard/tipos-servicio/actions';

type CategoriaRow = { id: number; nombre: string };

export default function TipoServicioForm(props: {
  mode: 'create' | 'edit';
  onSuccess?: () => void;
  initial?: { id: number; nombre: string; referencia: string | null; idcategoriaservicio: number | null };
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(props.initial?.nombre ?? '');
  const [referencia, setReferencia] = useState(props.initial?.referencia ?? '');
  const [idCategoria, setIdCategoria] = useState<number | ''>(props.initial?.idcategoriaservicio ?? '');

  const [categorias, setCategorias] = useState<CategoriaRow[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingCats(true);
        const { data, error: qErr } = await supabase
          .from('categoriasservicio')
          .select('id, nombre')
          .order('nombre', { ascending: true });
        if (qErr) throw qErr;
        setCategorias((data as CategoriaRow[]) ?? []);
      } catch (e: unknown) {
        const err = e as { message?: string };
        setError(err?.message || 'Error al cargar categorías');
      } finally {
        setLoadingCats(false);
      }
    };
    run();
  }, []);

  const canSubmit = useMemo(() => nombre.trim().length > 0 && !saving, [nombre, saving]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSaving(true);
      setError(null);

      const payload = {
        nombre,
        referencia: referencia.trim() ? referencia.trim() : null,
        idcategoriaservicio: idCategoria === '' ? null : Number(idCategoria),
      };

      if (props.mode === 'create') {
        await createTipoServicio(payload);
      } else {
        await updateTipoServicio(props.initial!.id, payload);
      }

      if (props.onSuccess) {
        props.onSuccess();
      } else {
        router.push('/admin/dashboard/tipos-servicio');
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
        {props.mode === 'create' ? 'Alta de Tipo de Servicio' : 'Edición de Tipo de Servicio'}
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
          onChange={(e) => setNombre(e.target.value)}
          required
          disabled={saving}
          fullWidth
        />

        <FormControl fullWidth disabled={saving || loadingCats}>
          <InputLabel id="categoria-label">Categoría</InputLabel>
          <Select
            labelId="categoria-label"
            label="Categoría"
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value as number | '')}
          >
            <MenuItem value="">Sin categoría</MenuItem>
            {categorias.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Referencia"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          disabled={saving}
          multiline
          minRows={3}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          startIcon={saving ? undefined : <SaveIcon />}
          disabled={!canSubmit}
          sx={{
            backgroundColor: 'var(--primary)',
            color: 'var(--text-primary)',
            '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.9)' },
            transition: 'all 0.5s ease',
            justifySelf: 'start',
          }}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
        </Button>
      </Box>
    </Paper>
  );
}


