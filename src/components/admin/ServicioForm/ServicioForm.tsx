'use client';

import type { HTMLAttributes, Key } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import type { AutocompleteRenderGroupParams } from '@mui/material/Autocomplete';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import dayjs from '@/lib/dayjs';
import { supabase } from '@/lib/supabase/client';
import { createServicio, updateServicio } from '@/app/admin/dashboard/_actions/servicios';

type VehiculoRow = { id: number; patente: string; modelo: string | null };
type ClienteRow = {
  id: number;
  apellidos: string;
  nombres: string;
  telefono: number | null;
  email: string;
  idprovincia: number | null;
  localidad: string | null;
  direccion: string | null;
};
type MarcaRow = { id: number; descripcion: string };
type ProvinciaRow = { id: number; descripcion: string };
type TipoServicioRow = {
  id: number;
  nombre: string;
  idcategoriaservicio: number | null;
  categoriasservicio?: { nombre: string } | null;
  categoriaNombre?: string | null;
};
type EstadoRow = { id: number; descripcion: string };

type DetalleServicioDraft = {
  key: string;
  idtiposervicio: number | null;
  proximoenkm: string; // mostrado con separador
  comentario: string;
  idestado: number | null;
  recomendacion: string;
};

export default function ServicioForm(props: {
  mode: 'create' | 'edit';
  onSuccess?: () => void;
  initial?: {
    id: number;
    idvehiculo: number;
    fechaservicio: string; // YYYY-MM-DD
    kmservicio: number;
    calificacion: number | null;
    comentario: string | null;
    fotoservicio?: string | null;
    detalles?: Array<{
      id: number;
      idtiposervicio: number | null;
      proximoenkm: number | null;
      comentario: string | null;
      idestado: number | null;
      recomendacion: string | null;
    }>;
  };
}) {
  const router = useRouter();

  const renderTipoGroup = (params: AutocompleteRenderGroupParams) => (
    <li key={params.key}>
      <Box
        sx={{
          px: 2,
          py: 1,
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: 'rgba(4, 0, 23, 0.98)',
          borderBottom: '1px solid rgba(139, 26, 26, 0.25)',
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 800, letterSpacing: '0.08em' }}
        >
          {params.group}
        </Typography>
      </Box>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
        {params.children}
      </Box>
    </li>
  );

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

  const compressImageToDataUrl = async (file: File, opts?: { maxSide?: number; quality?: number }) => {
    const maxSide = opts?.maxSide ?? 1280;
    const quality = opts?.quality ?? 0.75;

    // Preferimos JPEG para achicar (WebP sería ideal pero no siempre está disponible en canvas según browser).
    const targetMime = 'image/jpeg';

    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * ratio));
    const height = Math.max(1, Math.round(bitmap.height * ratio));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo procesar la imagen');

    ctx.drawImage(bitmap, 0, 0, width, height);

    // dataURL -> "data:image/jpeg;base64,..."
    return canvas.toDataURL(targetMime, quality);
  };

  const byteaToBase64 = (value: string): string | null => {
    if (!value) return null;

    // PostgREST suele devolver BYTEA como "\\x<hex>" (texto)
    if (value.startsWith('\\x')) {
      const hex = value.slice(2);
      if (hex.length % 2 !== 0) return null;
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
      }
      // Convertir a base64 sin reventar el stack (por chunks)
      let binary = '';
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      return btoa(binary);
    }

    // Si ya viene como base64 (algunos setups/devtools lo muestran así)
    if (/^[A-Za-z0-9+/]+={0,2}$/.test(value)) {
      return value;
    }

    return null;
  };

  const [idVehiculo, setIdVehiculo] = useState<number | ''>(props.initial?.idvehiculo ?? '');
  const [idCliente, setIdCliente] = useState<number | null>(null);
  const [fechaServicio, setFechaServicio] = useState(
    props.initial?.fechaservicio ? dayjs(props.initial.fechaservicio).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
  );
  const [kmServicio, setKmServicio] = useState(props.initial?.kmservicio ? formatKm(String(props.initial.kmservicio)) : '');
  const [calificacion, setCalificacion] = useState<number | ''>(props.initial?.calificacion ?? '');
  const [comentario, setComentario] = useState(props.initial?.comentario ?? '');

  const [vehiculos, setVehiculos] = useState<Array<VehiculoRow & { idcliente: number | null; idmarca: number | null }>>([]);
  const [clientes, setClientes] = useState<ClienteRow[]>([]);
  const [marcas, setMarcas] = useState<MarcaRow[]>([]);
  const [provincias, setProvincias] = useState<ProvinciaRow[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicioRow[]>([]);
  const [estados, setEstados] = useState<EstadoRow[]>([]);

  const clientesById = useMemo(() => {
    const m = new Map<number, ClienteRow>();
    clientes.forEach((c) => m.set(c.id, c));
    return m;
  }, [clientes]);

  const marcasById = useMemo(() => {
    const m = new Map<number, MarcaRow>();
    marcas.forEach((b) => m.set(b.id, b));
    return m;
  }, [marcas]);

  const provinciasById = useMemo(() => {
    const m = new Map<number, ProvinciaRow>();
    provincias.forEach((p) => m.set(p.id, p));
    return m;
  }, [provincias]);

  const selectedCliente = useMemo(() => {
    return idCliente ? clientesById.get(idCliente) ?? null : null;
  }, [idCliente, clientesById]);

  const selectedClienteDireccion = useMemo(() => {
    if (!selectedCliente) return '—';
    const prov = selectedCliente.idprovincia ? provinciasById.get(selectedCliente.idprovincia)?.descripcion : null;
    const parts = [prov, selectedCliente.localidad, selectedCliente.direccion].filter(
      (x): x is string => typeof x === 'string' && x.trim().length > 0
    );
    return parts.length > 0 ? parts.join(' - ') : '—';
  }, [selectedCliente, provinciasById]);

  const [bulkTipos, setBulkTipos] = useState<TipoServicioRow[]>([]);

  const [detalles, setDetalles] = useState<DetalleServicioDraft[]>(() => {
    const fromInitial = props.initial?.detalles ?? [];
    return fromInitial.map((d, idx) => ({
      key: `init-${d.id ?? idx}`,
      idtiposervicio: d.idtiposervicio ?? null,
      proximoenkm: d.proximoenkm ? formatKm(String(d.proximoenkm)) : '',
      comentario: d.comentario ?? '',
      idestado: d.idestado ?? null,
      recomendacion: d.recomendacion ?? '',
    }));
  });

  const [loadingVehiculos, setLoadingVehiculos] = useState(true);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetalleNotas, setShowDetalleNotas] = useState(true);

  // Foto del servicio (vehículo)
  const [fotoBase64, setFotoBase64] = useState<string | null>(null); // base64 sin prefix
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(null); // dataURL
  const [fotoAction, setFotoAction] = useState<'keep' | 'set' | 'clear'>('keep');

  // Si estamos editando y el servicio ya tiene foto guardada, mostrarla.
  useEffect(() => {
    if (props.mode !== 'edit') return;
    if (!props.initial?.fotoservicio) return;
    // No pisar si el usuario ya seleccionó/limpió una foto
    if (fotoAction !== 'keep') return;
    if (fotoPreviewUrl) return;

    const b64 = byteaToBase64(props.initial.fotoservicio);
    if (!b64) return;

    setFotoBase64(b64);
    setFotoPreviewUrl(`data:image/jpeg;base64,${b64}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode, props.initial?.fotoservicio]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingVehiculos(true);
        setLoadingRefs(true);

        const [
          { data: vehData, error: qErr },
          { data: tiposData, error: tiposErr },
          { data: estadosData, error: estadosErr },
          { data: clientesData, error: clientesErr },
          { data: marcasData, error: marcasErr },
          { data: provinciasData, error: provinciasErr },
        ] = await Promise.all([
          supabase.from('vehiculo').select('id, patente, modelo, idcliente, idmarca').order('patente', { ascending: true }),
          supabase
            .from('tiposservicio')
            .select('id, nombre, idcategoriaservicio')
            .order('nombre', { ascending: true }),
          supabase.from('estados').select('id, descripcion').order('descripcion', { ascending: true }),
          supabase
            .from('clientes')
            .select('id, apellidos, nombres, telefono, email, idprovincia, localidad, direccion')
            .order('apellidos', { ascending: true }),
          supabase.from('marcas').select('id, descripcion').order('descripcion', { ascending: true }),
          supabase.from('provincias').select('id, descripcion').order('descripcion', { ascending: true }),
        ]);

        if (qErr) throw qErr;
        if (tiposErr) throw tiposErr;
        if (estadosErr) throw estadosErr;
        if (clientesErr) throw clientesErr;
        if (marcasErr) throw marcasErr;
        if (provinciasErr) throw provinciasErr;

        setVehiculos(
          ((vehData as Array<VehiculoRow & { idcliente: number | null; idmarca: number | null }>) ?? []) as Array<
            VehiculoRow & { idcliente: number | null; idmarca: number | null }
          >
        );
        setClientes((clientesData as ClienteRow[]) ?? []);
        setMarcas((marcasData as MarcaRow[]) ?? []);
        setProvincias((provinciasData as ProvinciaRow[]) ?? []);

        // Si venimos en modo edición, auto-completar cliente desde el vehículo seleccionado
        if (idVehiculo !== '') {
          const v = (vehData as Array<VehiculoRow & { idcliente: number | null; idmarca: number | null }>)?.find(
            (x) => x.id === Number(idVehiculo)
          );
          setIdCliente(v?.idcliente ?? null);
        }

        const tiposBase = ((tiposData as TipoServicioRow[]) ?? []).map((t) => ({
          ...t,
          categoriaNombre: null as string | null,
        }));

        // Join robusto con categorías (sin depender de FK/relaciones de PostgREST)
        const categoriaIds = Array.from(
          new Set(
            (tiposBase ?? [])
              .map((t) => t.idcategoriaservicio)
              .filter((id): id is number => typeof id === 'number')
          )
        );

        if (categoriaIds.length > 0) {
          const { data: cats, error: catsErr } = await supabase
            .from('categoriasservicio')
            .select('id, nombre')
            .in('id', categoriaIds);

          if (!catsErr) {
            const catsById = new Map<number, { id: number; nombre: string }>();
            (cats ?? []).forEach((c) => catsById.set(c.id, c));
            tiposBase.forEach((t) => {
              t.categoriaNombre = t.idcategoriaservicio ? catsById.get(t.idcategoriaservicio)?.nombre ?? null : null;
            });
          }
        }

        // Ordenar para que el agrupado se vea consistente
        tiposBase.sort((a, b) => {
          const ca = a.categoriaNombre ?? 'Sin categoría';
          const cb = b.categoriaNombre ?? 'Sin categoría';
          const cCmp = ca.localeCompare(cb, 'es');
          if (cCmp !== 0) return cCmp;
          return a.nombre.localeCompare(b.nombre, 'es');
        });

        setTiposServicio(tiposBase);
        setEstados((estadosData as EstadoRow[]) ?? []);
      } catch (e: unknown) {
        const err = e as { message?: string };
        setError(err?.message || 'Error al cargar vehículos');
      } finally {
        setLoadingVehiculos(false);
        setLoadingRefs(false);
      }
    };
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSubmit = useMemo(() => {
    return idVehiculo !== '' && fechaServicio.trim().length > 0 && kmServicio.trim().length > 0 && !saving;
  }, [idVehiculo, fechaServicio, kmServicio, saving]);

  const kmHeader = useMemo(() => parseKmToNumberOrNull(kmServicio), [kmServicio]);

  const headerReadyForDetalles = useMemo(() => {
    return idVehiculo !== '' && idCliente !== null && kmHeader !== null && kmHeader > 0;
  }, [idVehiculo, idCliente, kmHeader]);

  const selectedTipoIds = useMemo(() => {
    const set = new Set<number>();
    detalles.forEach((d) => {
      if (typeof d.idtiposervicio === 'number') set.add(d.idtiposervicio);
    });
    return set;
  }, [detalles]);

  const tiposById = useMemo(() => {
    const m = new Map<number, TipoServicioRow>();
    tiposServicio.forEach((t) => m.set(t.id, t));
    return m;
  }, [tiposServicio]);

  const groupedDetalles = useMemo(() => {
    const groups = new Map<string, Array<DetalleServicioDraft & { _idx: number }>>();

    detalles.forEach((d, idx) => {
      const tipo = typeof d.idtiposervicio === 'number' ? tiposById.get(d.idtiposervicio) : undefined;
      const group = tipo?.categoriaNombre || (d.idtiposervicio ? 'Sin categoría' : 'Sin tipo');
      const arr = groups.get(group) ?? [];
      arr.push({ ...d, _idx: idx });
      groups.set(group, arr);
    });

    // Ordenar grupos: primero categorías normales, luego "Sin categoría" y "Sin tipo"
    const groupOrder = (name: string) => {
      if (name === 'Sin tipo') return 2;
      if (name === 'Sin categoría') return 1;
      return 0;
    };

    return Array.from(groups.entries())
      .sort((a, b) => {
        const oa = groupOrder(a[0]);
        const ob = groupOrder(b[0]);
        if (oa !== ob) return oa - ob;
        return a[0].localeCompare(b[0], 'es');
      })
      .map(([group, items]) => ({
        group,
        items: items.sort((x, y) => x._idx - y._idx),
      }));
  }, [detalles, tiposById]);

  const hasProximoMenorAKmHeader = useMemo(() => {
    if (!headerReadyForDetalles) return false;
    const header = kmHeader ?? 0;
    return detalles.some((d) => {
      const p = parseKmToNumberOrNull(d.proximoenkm);
      return p !== null && p < header;
    });
  }, [detalles, headerReadyForDetalles, kmHeader]);

  const hasDuplicateTipos = useMemo(() => {
    const seen = new Set<number>();
    for (const d of detalles) {
      if (typeof d.idtiposervicio !== 'number') continue;
      if (seen.has(d.idtiposervicio)) return true;
      seen.add(d.idtiposervicio);
    }
    return false;
  }, [detalles]);

  const addDetalle = (partial?: Partial<DetalleServicioDraft>) => {
    if (!headerReadyForDetalles) {
      setError('Completá Vehículo, Cliente y KM Actual antes de cargar detalles');
      return;
    }
    setDetalles((prev) => [
      ...prev,
      {
        key: `new-${prev.length}`,
        idtiposervicio: null,
        proximoenkm: '',
        comentario: '',
        idestado: null,
        recomendacion: '',
        ...partial,
      },
    ]);
  };

  const removeDetalle = (key: string) => setDetalles((prev) => prev.filter((d) => d.key !== key));

  const duplicateDetalle = (key: string) => {
    setDetalles((prev) => {
      const idx = prev.findIndex((d) => d.key === key);
      if (idx < 0) return prev;
      const src = prev[idx];
      const copy: DetalleServicioDraft = { ...src, key: `dup-${prev.length}` };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  const setDetalle = (key: string, patch: Partial<DetalleServicioDraft>) => {
    setDetalles((prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  };

  const addBulk = () => {
    if (bulkTipos.length === 0) return;
    if (!headerReadyForDetalles) {
      setError('Completá Vehículo, Cliente y KM Actual antes de cargar detalles');
      return;
    }
    setDetalles((prev) => {
      const next = [...prev];
      const existing = new Set<number>();
      next.forEach((d) => {
        if (typeof d.idtiposervicio === 'number') existing.add(d.idtiposervicio);
      });
      bulkTipos.forEach((t) => {
        if (existing.has(t.id)) return; // no duplicar tipos ya agregados
        next.push({
          key: `bulk-${next.length}`,
          idtiposervicio: t.id,
          proximoenkm: '',
          comentario: '',
          idestado: null,
          recomendacion: '',
        });
        existing.add(t.id);
      });
      return next;
    });
    setBulkTipos([]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSaving(true);
      setError(null);

      const kmNum = parseKmToNumberOrNull(kmServicio);
      if (kmNum === null || kmNum <= 0) throw new Error('KM actual inválido');

      if (hasDuplicateTipos) throw new Error('No podés repetir el mismo Tipo de Servicio en los detalles');
      if (detalles.length > 0 && idCliente === null) throw new Error('Cliente es obligatorio');
      if (detalles.length > 0 && !headerReadyForDetalles) {
        throw new Error('Completá Vehículo, Cliente y KM Actual antes de cargar detalles');
      }
      if (hasProximoMenorAKmHeader) {
        throw new Error('Ningún "Próximo (km)" puede ser menor que el KM Actual de la cabecera');
      }

      const detallesPayload = detalles.map((d) => ({
        idtiposervicio: d.idtiposervicio ?? null,
        proximoenkm: parseKmToNumberOrNull(d.proximoenkm),
        comentario: d.comentario.trim() ? d.comentario.trim() : null,
        idestado: d.idestado ?? null,
        recomendacion: d.recomendacion.trim() ? d.recomendacion.trim() : null,
      }));

      const payload = {
        idvehiculo: Number(idVehiculo),
        fechaservicio: fechaServicio,
        kmservicio: kmNum,
        calificacion: calificacion === '' ? null : Number(calificacion),
        comentario: comentario.trim() ? comentario.trim() : null,
        detalles: detallesPayload,
        ...(fotoAction === 'set' ? { fotoservicioBase64: fotoBase64 } : {}),
        ...(fotoAction === 'clear' ? { fotoservicioBase64: null } : {}),
      };

      if (props.mode === 'create') {
        await createServicio(payload);
      } else {
        await updateServicio(props.initial!.id, payload);
      }

      if (props.onSuccess) {
        props.onSuccess();
      } else {
        router.push('/admin/dashboard/servicios');
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
        {props.mode === 'create' ? 'Alta de Servicio' : 'Edición de Servicio'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <Autocomplete
          options={vehiculos}
          loading={loadingVehiculos}
          value={idVehiculo === '' ? null : vehiculos.find((v) => v.id === Number(idVehiculo)) ?? null}
          onChange={(_, v) => {
            if (!v) {
              setIdVehiculo('');
              setIdCliente(null);
              return;
            }
            setIdVehiculo(v.id);
            setIdCliente(v.idcliente ?? null);
          }}
          getOptionLabel={(v) => {
            const cli = v.idcliente ? clientesById.get(v.idcliente) : undefined;
            const marca = v.idmarca ? marcasById.get(v.idmarca) : undefined;
            const cliLabel = cli ? `${cli.apellidos}, ${cli.nombres}` : 'Sin cliente';
            const marcaModelo = `${marca?.descripcion ?? ''} ${v.modelo ?? ''}`.trim();
            return `${v.patente} — ${cliLabel}${marcaModelo ? ` — ${marcaModelo}` : ''}`;
          }}
          renderOption={(props, option) => {
            const { key, ...rest } = props as unknown as { key: Key } & HTMLAttributes<HTMLLIElement>;
            const cli = option.idcliente ? clientesById.get(option.idcliente) : undefined;
            const marca = option.idmarca ? marcasById.get(option.idmarca) : undefined;
            const marcaModelo = `${marca?.descripcion ?? ''} ${option.modelo ?? ''}`.trim();
            return (
              <Box
                component="li"
                key={key}
                {...rest}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <Typography sx={{ fontWeight: 800, color: 'var(--text-primary)' }}>{option.patente}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                  {cli ? `${cli.apellidos}, ${cli.nombres}` : 'Sin cliente'}
                  {marcaModelo ? ` • ${marcaModelo}` : ''}
                </Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Vehículo"
              placeholder="Buscar por patente o cliente…"
              required
            />
          )}
        />

        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: 'rgba(4, 0, 23, 0.55)',
            border: '1px solid rgba(139, 26, 26, 0.15)',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.02em', mb: 1 }}
          >
            Datos del Cliente
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                Cliente
              </Typography>
              <Typography sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                {selectedCliente ? `${selectedCliente.apellidos}, ${selectedCliente.nombres}` : '—'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                Teléfono
              </Typography>
              <Typography sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                {selectedCliente?.telefono ? (
                  <Link
                    href={`tel:${selectedCliente.telefono}`}
                    underline="hover"
                    sx={{ color: 'var(--text-primary)', fontWeight: 800 }}
                  >
                    {String(selectedCliente.telefono)}
                  </Link>
                ) : (
                  '—'
                )}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                Email
              </Typography>
              <Typography sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                {selectedCliente?.email ? (
                  <Link
                    href={`mailto:${selectedCliente.email}`}
                    underline="hover"
                    sx={{ color: 'var(--text-primary)', fontWeight: 800 }}
                  >
                    {selectedCliente.email}
                  </Link>
                ) : (
                  '—'
                )}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                Dirección completa
              </Typography>
              <Typography sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                {selectedClienteDireccion}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: 'rgba(4, 0, 23, 0.55)',
            border: '1px solid rgba(139, 26, 26, 0.15)',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.92)', mb: 0.5 }}>
                Foto del Vehículo
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                Podés adjuntar una imagen o sacar una foto desde el celular.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                sx={{
                  borderColor: 'rgba(139, 26, 26, 0.4)',
                  color: 'var(--text-primary)',
                  '&:hover': { borderColor: 'rgba(139, 26, 26, 0.7)' },
                }}
              >
                Adjuntar foto
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) => {
                    (async () => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Evitar archivos absurdamente grandes antes de comprimir
                      if (file.size > 12 * 1024 * 1024) {
                        setError('La foto es muy pesada (máx. 12MB).');
                        return;
                      }

                      try {
                        setError(null);

                        const dataUrl = await compressImageToDataUrl(file, { maxSide: 1280, quality: 0.75 });
                        const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : null;

                        // Límite práctico: el base64 crece ~33%. Para evitar romper el body de Server Actions,
                        // nos mantenemos debajo de ~900KB de base64 (≈ 675KB binario).
                        const approxBytes = base64 ? Math.floor((base64.length * 3) / 4) : 0;
                        if (approxBytes > 900 * 1024) {
                          setError(
                            'La foto sigue siendo muy grande. Probá con una foto más cercana o con menos resolución.'
                          );
                          return;
                        }

                        setFotoPreviewUrl(dataUrl);
                        setFotoBase64(base64);
                        setFotoAction('set');
                      } catch (err: unknown) {
                        const msg = (err as { message?: string })?.message;
                        setError(msg || 'No se pudo procesar la foto');
                      }
                    })();
                  }}
                />
              </Button>

              <Button
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                disabled={fotoAction !== 'set' && fotoAction !== 'clear' && !fotoPreviewUrl}
                onClick={() => {
                  setFotoBase64(null);
                  setFotoPreviewUrl(null);
                  setFotoAction('clear');
                }}
                sx={{
                  borderColor: 'rgba(255, 107, 107, 0.45)',
                  color: '#ff6b6b',
                  '&:hover': { borderColor: 'rgba(255, 107, 107, 0.8)' },
                }}
              >
                Quitar
              </Button>
            </Box>
          </Box>

          {fotoPreviewUrl && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
              <Box
                component="img"
                src={fotoPreviewUrl}
                alt="Foto del vehículo"
                sx={{
                  width: { xs: '100%', sm: 360 },
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  border: '1px solid rgba(139, 26, 26, 0.2)',
                }}
              />
            </Box>
          )}
        </Paper>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <TextField
            label="Fecha"
            type="date"
            value={fechaServicio}
            onChange={(e) => setFechaServicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="KM Actual"
            value={kmServicio}
            onChange={(e) => setKmServicio(formatKm(e.target.value))}
            required
            inputProps={{ inputMode: 'numeric' }}
          />
        </Box>

        <FormControl fullWidth>
          <InputLabel id="calificacion-label">Calificación General</InputLabel>
          <Select
            labelId="calificacion-label"
            label="Calificación General"
            value={calificacion}
            onChange={(e) => setCalificacion(e.target.value as number | '')}
          >
            <MenuItem value="">Sin calificación</MenuItem>
            {[1, 2, 3, 4, 5].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Comentario General"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          multiline
          minRows={3}
        />

        <Divider sx={{ borderColor: 'rgba(139, 26, 26, 0.25)' }} />

        <Box sx={{ display: 'grid', gap: 1 }}>
          {hasDuplicateTipos && (
            <Alert severity="warning">
              Tenés tipos de servicio repetidos en los detalles. Cada tipo solo puede agregarse una vez por servicio.
            </Alert>
          )}
          {!headerReadyForDetalles && (
            <Alert severity="info">
              Para cargar/editar detalles primero completá <strong>Vehículo</strong>, <strong>Cliente</strong> y{' '}
              <strong>KM Actual</strong>.
            </Alert>
          )}
          {hasProximoMenorAKmHeader && (
            <Alert severity="warning">
              Hay detalles con <strong>Próximo (km)</strong> menor al <strong>KM Actual</strong> de la cabecera.
            </Alert>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-family-body)' }}
            >
              Detalles del Servicio ({detalles.length})
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Tooltip title={showDetalleNotas ? 'Ocultar comentarios y recomendaciones' : 'Mostrar comentarios y recomendaciones'}>
                <span>
                  <IconButton
                    size="small"
                    onClick={() => setShowDetalleNotas((v) => !v)}
                    sx={{
                      color: 'var(--text-secondary)',
                      border: '1px solid rgba(139, 26, 26, 0.25)',
                      borderRadius: '10px',
                    }}
                    aria-label={showDetalleNotas ? 'Ocultar comentarios y recomendaciones' : 'Mostrar comentarios y recomendaciones'}
                  >
                    {showDetalleNotas ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </span>
              </Tooltip>
              <Button
                variant="outlined"
                size="small"
                onClick={() => addDetalle()}
                startIcon={<AddIcon />}
                disabled={!headerReadyForDetalles}
                sx={{
                  borderColor: 'rgba(139, 26, 26, 0.4)',
                  color: 'var(--text-primary)',
                  '&:hover': { borderColor: 'rgba(139, 26, 26, 0.7)' },
                }}
              >
                Agregar fila
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
              alignItems: 'start',
            }}
          >
            <Autocomplete
              multiple
              options={tiposServicio}
              value={bulkTipos}
              onChange={(_, v) => setBulkTipos(v)}
              groupBy={(o) => o.categoriaNombre || 'Sin categoría'}
              getOptionLabel={(o) => `${o.nombre}${o.categoriaNombre ? ` — ${o.categoriaNombre}` : ''}`}
              loading={loadingRefs}
              renderGroup={renderTipoGroup}
              disabled={!headerReadyForDetalles}
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => {
                const { key, ...rest } = props as unknown as { key: Key } & HTMLAttributes<HTMLLIElement>;
                return (
                  <Box
                    component="li"
                    key={key}
                    {...rest}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Checkbox
                        checked={selected}
                        size="small"
                        sx={{
                          p: 0,
                          color: 'rgba(255,255,255,0.7)',
                          '&.Mui-checked': { color: 'var(--primary)' },
                        }}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>{option.nombre}</Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                          {option.categoriaNombre || 'Sin categoría'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              }}
              renderInput={(params) => <TextField {...params} label="Agregar varios tipos de servicio" />}
              filterOptions={(options, state) => {
                const input = state.inputValue.toLowerCase();
                return options
                  .filter((o) => !selectedTipoIds.has(o.id))
                  .filter((o) => {
                    if (!input) return true;
                    const label = `${o.nombre} ${o.categoriaNombre ?? ''}`.toLowerCase();
                    return label.includes(input);
                  });
              }}
            />
            <Button
              variant="contained"
              onClick={addBulk}
              disabled={bulkTipos.length === 0}
              sx={{
                backgroundColor: 'var(--primary)',
                color: 'var(--text-primary)',
                '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.9)' },
                height: { xs: 'auto', md: 56 },
              }}
            >
              Agregar
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gap: 1.25 }}>
            {detalles.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Tip: podés seleccionar varios tipos arriba y presionar “Agregar” para cargar 40–50 ítems rápido.
              </Typography>
            ) : (
              groupedDetalles.map(({ group, items }) => (
                <Box key={group} sx={{ display: 'grid', gap: 1.25 }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: 'rgba(4, 0, 23, 0.65)',
                      border: '1px solid rgba(139, 26, 26, 0.18)',
                      borderRadius: 'var(--border-radius-md)',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.02em' }}
                    >
                      {group}
                    </Typography>
                  </Box>

                  {items.map((d, idxInGroup) => {
                    const tipoValue = d.idtiposervicio
                      ? tiposServicio.find((t) => t.id === d.idtiposervicio) ?? null
                      : null;

                    // idx global para el label
                    const idxGlobal = detalles.findIndex((x) => x.key === d.key);

                    return (
                      <Paper
                        key={d.key}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          backgroundColor: 'rgba(4, 0, 23, 0.55)',
                          border: '1px solid rgba(139, 26, 26, 0.15)',
                          borderRadius: 'var(--border-radius-md)',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'grid',
                            gap: 1.25,
                            gridTemplateColumns: { xs: '1fr', md: '1.4fr 0.6fr 0.9fr auto' },
                            alignItems: 'center',
                          }}
                        >
                          <Autocomplete
                            options={tiposServicio}
                            value={tipoValue}
                            onChange={(_, v) => {
                              if (!v) return setDetalle(d.key, { idtiposervicio: null });
                              const alreadyUsed = detalles.some(
                                (x) =>
                                  x.key !== d.key && typeof x.idtiposervicio === 'number' && x.idtiposervicio === v.id
                              );
                              if (alreadyUsed) {
                                setError('Ese Tipo de Servicio ya fue agregado en otro detalle');
                                return;
                              }
                              setDetalle(d.key, { idtiposervicio: v.id });
                            }}
                            groupBy={(o) => o.categoriaNombre || 'Sin categoría'}
                            getOptionLabel={(o) => `${o.nombre}${o.categoriaNombre ? ` — ${o.categoriaNombre}` : ''}`}
                            renderGroup={renderTipoGroup}
                            disabled={!headerReadyForDetalles}
                            renderOption={(props, option) => {
                              const { key, ...rest } = props as unknown as { key: Key } & HTMLAttributes<HTMLLIElement>;
                              return (
                                <Box
                                  component="li"
                                  key={key}
                                  {...rest}
                                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                                >
                                  <Typography sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>{option.nombre}</Typography>
                                  <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                    {option.categoriaNombre || 'Sin categoría'}
                                  </Typography>
                                </Box>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label={`Tipo de servicio #${(idxGlobal >= 0 ? idxGlobal : idxInGroup) + 1}`} />
                            )}
                            isOptionEqualToValue={(opt, val) => opt.id === val.id}
                            filterOptions={(options, state) => {
                              const input = state.inputValue.toLowerCase();
                              const currentId = d.idtiposervicio;
                              return options
                                .filter((o) => {
                                  // permitir el actual aunque esté en selectedTipoIds
                                  if (typeof currentId === 'number' && o.id === currentId) return true;
                                  if (selectedTipoIds.has(o.id)) return false;
                                  return true;
                                })
                                .filter((o) => {
                                  if (!input) return true;
                                  const label = `${o.nombre} ${o.categoriaNombre ?? ''}`.toLowerCase();
                                  return label.includes(input);
                                });
                            }}
                          />

                          <TextField
                            label="Próximo (km)"
                            value={d.proximoenkm}
                            onChange={(e) => setDetalle(d.key, { proximoenkm: formatKm(e.target.value) })}
                            inputProps={{ inputMode: 'numeric' }}
                            disabled={!headerReadyForDetalles}
                          />

                          <FormControl fullWidth>
                            <InputLabel id={`estado-${d.key}`}>Estado</InputLabel>
                            <Select
                              labelId={`estado-${d.key}`}
                              label="Estado"
                              value={d.idestado === null ? '' : String(d.idestado)}
                              onChange={(e) => {
                                const v = String(e.target.value);
                                setDetalle(d.key, { idestado: v === '' ? null : Number(v) });
                              }}
                              disabled={!headerReadyForDetalles}
                            >
                              <MenuItem value="">Sin estado</MenuItem>
                              {estados.map((es) => (
                                <MenuItem key={es.id} value={String(es.id)}>
                                  {es.descripcion}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 0.5 }}>
                            <Tooltip title="Duplicar fila">
                              <IconButton
                                size="small"
                                onClick={() => duplicateDetalle(d.key)}
                                sx={{ color: 'var(--text-secondary)' }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar fila">
                              <IconButton
                                size="small"
                                onClick={() => removeDetalle(d.key)}
                                sx={{ color: '#ff6b6b' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'grid',
                            gap: 1.25,
                            mt: 1.25,
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                          }}
                        >
                          {showDetalleNotas && (
                            <>
                              <TextField
                                label="Comentario (detalle)"
                                value={d.comentario}
                                onChange={(e) => setDetalle(d.key, { comentario: e.target.value })}
                                multiline
                                minRows={2}
                                disabled={!headerReadyForDetalles}
                              />
                              <TextField
                                label="Recomendación"
                                value={d.recomendacion}
                                onChange={(e) => setDetalle(d.key, { recomendacion: e.target.value })}
                                multiline
                                minRows={2}
                                disabled={!headerReadyForDetalles}
                              />
                            </>
                          )}
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              ))
            )}
          </Box>
        </Box>

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


