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
import dayjs from '@/lib/dayjs';
import { supabase } from '@/lib/supabase/client';
import { createVehiculo, updateVehiculo } from '@/app/admin/dashboard/_actions/vehiculos';

type MarcaRow = { id: number; descripcion: string };
type ClienteRow = { id: number; nombres: string; apellidos: string };

export default function VehiculoForm(props: {
  mode: 'create' | 'edit';
  onSuccess?: () => void;
  initial?: {
    id: number;
    patente: string;
    idmarca: number | null;
    modelo: string | null;
    anio: string | null;
    kmactual: number | null;
    idcliente: number | null;
    commentarioprivado?: string | null;
  };
}) {
  const router = useRouter();

  const formatPatente = (value: string) => {
    const raw = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Regla pedida:
    // - si contiene 7 caracteres -> ##-###-## (asumimos 7 dígitos)
    // - si contiene 6 caracteres -> ###-###
    if (raw.length === 7) {
      // Aplicamos la máscara siempre que haya 7 caracteres "limpios"
      return `${raw.slice(0, 2)}-${raw.slice(2, 5)}-${raw.slice(5, 7)}`;
    }

    if (raw.length === 6) {
      return `${raw.slice(0, 3)}-${raw.slice(3, 6)}`;
    }

    return raw;
  };

  const formatKm = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const normalized = digits.replace(/^0+(?=\d)/, '');
    return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseKmToNumberOrNull = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return null;
    const n = Number(digits);
    return Number.isFinite(n) ? n : null;
  };

  const [patente, setPatente] = useState(props.initial?.patente ?? '');
  const [idMarca, setIdMarca] = useState<number | ''>(props.initial?.idmarca ?? '');
  const [modelo, setModelo] = useState(props.initial?.modelo ?? '');
  const [anio, setAnio] = useState(props.initial?.anio ? dayjs(props.initial.anio).format('YYYY') : '');
  const [kmActual, setKmActual] = useState(props.initial?.kmactual ? formatKm(String(props.initial.kmactual)) : '');
  const [idCliente, setIdCliente] = useState<number | ''>(props.initial?.idcliente ?? '');
  const [comentarioPrivado, setComentarioPrivado] = useState(props.initial?.commentarioprivado ?? '');

  const [marcas, setMarcas] = useState<MarcaRow[]>([]);
  const [clientes, setClientes] = useState<ClienteRow[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingLists(true);
        const [{ data: m, error: me }, { data: c, error: ce }] = await Promise.all([
          supabase.from('marcas').select('id, descripcion').order('descripcion', { ascending: true }),
          supabase.from('clientes').select('id, nombres, apellidos').order('apellidos', { ascending: true }),
        ]);
        if (me) throw me;
        if (ce) throw ce;
        setMarcas((m as MarcaRow[]) ?? []);
        setClientes((c as ClienteRow[]) ?? []);
      } catch (e: unknown) {
        const err = e as { message?: string };
        setError(err?.message || 'Error al cargar listas');
      } finally {
        setLoadingLists(false);
      }
    };
    run();
  }, []);

  const canSubmit = useMemo(() => patente.trim().length > 0 && !saving, [patente, saving]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSaving(true);
      setError(null);

      const kmNum = parseKmToNumberOrNull(kmActual);
      if (kmActual.trim().length > 0 && kmNum === null) throw new Error('KM actual inválido');

      const payload = {
        patente: formatPatente(patente).trim(),
        idmarca: idMarca === '' ? null : Number(idMarca),
        modelo: modelo.trim() ? modelo.trim() : null,
        // Columna en BD es DATE: guardamos solo el año como YYYY-01-01
        anio: anio.trim() ? `${anio.trim()}-01-01` : null,
        kmactual: kmNum ?? 0,
        idcliente: idCliente === '' ? null : Number(idCliente),
        commentarioprivado: comentarioPrivado.trim() ? comentarioPrivado.trim() : null,
      };

      if (props.mode === 'create') {
        await createVehiculo(payload);
      } else {
        await updateVehiculo(props.initial!.id, payload);
      }

      if (props.onSuccess) {
        props.onSuccess();
      } else {
        router.push('/admin/dashboard/vehiculos');
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
        {props.mode === 'create' ? 'Alta de Vehículo' : 'Edición de Vehículo'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label="Patente"
          value={patente}
          onChange={(e) => setPatente(formatPatente(e.target.value))}
          required
          inputProps={{ autoCapitalize: 'characters' }}
        />

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <FormControl fullWidth disabled={loadingLists}>
            <InputLabel id="marca-label">Marca</InputLabel>
            <Select
              labelId="marca-label"
              label="Marca"
              value={idMarca}
              onChange={(e) => setIdMarca(e.target.value as number | '')}
            >
              <MenuItem value="">Sin marca</MenuItem>
              {marcas.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
        </Box>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <TextField
            label="Año"
            value={anio}
            onChange={(e) => setAnio(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="YYYY"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 4 }}
          />
          <TextField
            label="KM Actual"
            value={kmActual}
            onChange={(e) => setKmActual(formatKm(e.target.value))}
            inputProps={{ inputMode: 'numeric' }}
          />
        </Box>

        <FormControl fullWidth disabled={loadingLists}>
          <InputLabel id="cliente-label">Cliente</InputLabel>
          <Select
            labelId="cliente-label"
            label="Cliente"
            value={idCliente}
            onChange={(e) => setIdCliente(e.target.value as number | '')}
          >
            <MenuItem value="">Sin cliente</MenuItem>
            {clientes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.apellidos}, {c.nombres}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Comentario Privado"
          value={comentarioPrivado}
          onChange={(e) => setComentarioPrivado(e.target.value)}
          multiline
          minRows={3}
          placeholder="Notas internas (no visibles para el cliente)"
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


