'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
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
import CustomButton from '@/utils/ui/button/CustomButton';
import dayjs from '@/lib/dayjs';
import { supabase } from '@/lib/supabase/client';
import { createCliente, updateCliente } from '@/app/admin/dashboard/_actions/clientes';

type ProvinciaRow = { id: number; descripcion: string };

export default function ClienteForm(props: {
  mode: 'create' | 'edit';
  onSuccess?: () => void;
  initial?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    telefono: number | null;
    idprovincia: number | null;
    localidad: string | null;
    direccion: string | null;
    fechanacimiento: string | null; // YYYY-MM-DD
    comentarioPrivado?: string | null;
  };
}) {
  const router = useRouter();

  // Función helper para capitalizar primera letra
  const capitalizeFirst = (text: string): string => {
    if (!text || text.length === 0) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const [nombres, setNombres] = useState(props.initial?.nombres ?? '');
  const [apellidos, setApellidos] = useState(props.initial?.apellidos ?? '');
  const [email, setEmail] = useState(props.initial?.email ?? '');
  const [telefono, setTelefono] = useState(props.initial?.telefono?.toString() ?? '');
  const [idProvincia, setIdProvincia] = useState<number | ''>(props.initial?.idprovincia ?? '');
  const [localidad, setLocalidad] = useState(props.initial?.localidad ?? '');
  const [direccion, setDireccion] = useState(props.initial?.direccion ?? '');
  const [comentarioPrivado, setComentarioPrivado] = useState(props.initial?.comentarioPrivado ?? '');
  const [fechaNacimiento, setFechaNacimiento] = useState(
    props.initial?.fechanacimiento ? dayjs(props.initial.fechanacimiento).format('YYYY-MM-DD') : ''
  );

  const [provincias, setProvincias] = useState<ProvinciaRow[]>([]);
  const [loadingProv, setLoadingProv] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingProv(true);
        const { data, error: qErr } = await supabase
          .from('provincias')
          .select('id, descripcion')
          .order('descripcion', { ascending: true });
        if (qErr) throw qErr;
        setProvincias((data as ProvinciaRow[]) ?? []);
      } catch (e: unknown) {
        const err = e as { message?: string };
        setError(err?.message || 'Error al cargar provincias');
      } finally {
        setLoadingProv(false);
      }
    };
    run();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      nombres.trim().length > 0 &&
      apellidos.trim().length > 0 &&
      email.trim().length > 0 &&
      telefono.trim().length > 0 &&
      !saving
    );
  }, [nombres, apellidos, email, telefono, saving]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSaving(true);
      setError(null);

      const telNum = Number(telefono);
      if (!Number.isFinite(telNum) || telNum <= 0) throw new Error('Teléfono inválido');

      const payload = {
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        email,
        telefono: telNum,
        idprovincia: idProvincia === '' ? null : Number(idProvincia),
        localidad: localidad.trim() ? localidad.trim() : null,
        direccion: direccion.trim() ? direccion.trim() : null,
        fechanacimiento: fechaNacimiento.trim() ? fechaNacimiento.trim() : null,
        comentarioPrivado: comentarioPrivado.trim() ? comentarioPrivado.trim() : null,
      };

      if (props.mode === 'create') {
        await createCliente(payload);
      } else {
        await updateCliente(props.initial!.id, payload);
      }

      if (props.onSuccess) {
        props.onSuccess();
      } else {
        router.push('/admin/dashboard/clientes');
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
        {props.mode === 'create' ? 'Alta de Cliente' : 'Edición de Cliente'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <TextField
            label="Nombres"
            value={nombres}
            onChange={(e) => {
              const value = e.target.value;
              // Permitir escribir normalmente, pero capitalizar al perder el foco
              setNombres(value);
            }}
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value) {
                setNombres(capitalizeFirst(value));
              }
            }}
            required
            helperText="Primera letra mayúscula, resto minúsculas"
          />
          <TextField
            label="Apellidos"
            value={apellidos}
            onChange={(e) => {
              const value = e.target.value;
              // Permitir escribir normalmente, pero capitalizar al perder el foco
              setApellidos(value);
            }}
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value) {
                setApellidos(capitalizeFirst(value));
              }
            }}
            required
            helperText="Primera letra mayúscula, resto minúsculas"
          />
        </Box>

        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <TextField
            label="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
            required
            inputProps={{ inputMode: 'numeric' }}
          />
          <TextField
            label="Fecha de Nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <FormControl fullWidth disabled={loadingProv}>
          <InputLabel id="provincia-label">Provincia</InputLabel>
          <Select
            labelId="provincia-label"
            label="Provincia"
            value={idProvincia}
            onChange={(e) => setIdProvincia(e.target.value as number | '')}
          >
            <MenuItem value="">Sin provincia</MenuItem>
            {provincias.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <TextField label="Localidad" value={localidad} onChange={(e) => setLocalidad(e.target.value)} />
          <TextField label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </Box>

        <TextField
          label="Comentario Privado"
          value={comentarioPrivado}
          onChange={(e) => setComentarioPrivado(e.target.value)}
          multiline
          minRows={3}
          placeholder="Notas internas (no visibles para el cliente)"
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


