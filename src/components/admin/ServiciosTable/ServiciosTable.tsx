'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { DataTable } from '@/utils/ui/table/DataTable';
import { supabase } from '@/lib/supabase/client';
import dayjs from '@/lib/dayjs';
import jsPDF from 'jspdf';

interface Servicio {
  id: number;
  fechaservicio?: string | null;
  kmservicio?: number | null;
  calificacion?: number | null;
  clienteNombre?: string | null;
  clienteEmail?: string | null;
  Vehiculo: {
    patente: string;
    modelo: string;
    Marcas: {
      descripcion: string;
    };
  } | null;
}

export function ServiciosTable(props?: {
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
  reloadToken?: number;
}) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServicios();
  }, [props?.reloadToken]);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      setError(null);

      // Evitar selects anidados (dependen de relaciones/FK en PostgREST)
      const { data: serviciosBase, error: fetchError } = await supabase
        .from('servicios')
        .select('*')
        .order('id', { ascending: false });

      if (fetchError) throw fetchError;

      const vehiculoIds = (serviciosBase ?? [])
        .map((s) => (s as { idvehiculo?: number | null }).idvehiculo)
        .filter((id): id is number => typeof id === 'number');

      const vehiculosById = new Map<
        number,
        { id: number; patente: string; modelo: string | null; idmarca: number | null; idcliente: number | null }
      >();
      const marcasById = new Map<number, { id: number; descripcion: string }>();
      const clientesById = new Map<number, { id: number; apellidos: string; nombres: string; email: string }>();

      if (vehiculoIds.length > 0) {
        const { data: vehiculos, error: vehiculosError } = await supabase
          .from('vehiculo')
          .select('id, patente, modelo, idmarca, idcliente')
          .in('id', vehiculoIds);

        if (vehiculosError) throw vehiculosError;

        (vehiculos ?? []).forEach((v) => vehiculosById.set(v.id, v));

        const marcaIds = (vehiculos ?? [])
          .map((v) => v.idmarca)
          .filter((id): id is number => typeof id === 'number');

        if (marcaIds.length > 0) {
          const { data: marcas, error: marcasError } = await supabase
            .from('marcas')
            .select('id, descripcion')
            .in('id', marcaIds);

          if (marcasError) throw marcasError;

          (marcas ?? []).forEach((m) => marcasById.set(m.id, m));
        }
      }

      // Traer clientes para poder mostrar "Apellido, Nombre" y enviar email
      const clienteIdsFromServicios = (serviciosBase ?? [])
        .map((s) => (s as { idcliente?: number | null }).idcliente)
        .filter((id): id is number => typeof id === 'number');

      const clienteIdsFromVehiculos = Array.from(vehiculosById.values())
        .map((v) => v.idcliente)
        .filter((id): id is number => typeof id === 'number');

      const clienteIds = Array.from(new Set([...clienteIdsFromServicios, ...clienteIdsFromVehiculos]));

      if (clienteIds.length > 0) {
        const { data: clientes, error: clientesErr } = await supabase
          .from('clientes')
          .select('id, apellidos, nombres, email')
          .in('id', clienteIds);

        if (clientesErr) throw clientesErr;
        (clientes ?? []).forEach((c) => clientesById.set(c.id, c));
      }

      const serviciosMapped: Servicio[] = (serviciosBase ?? []).map((s) => {
        const row = s as {
          id: number;
          fechaservicio?: string | null;
          kmservicio?: number | null;
          calificacion?: number | null;
          idvehiculo?: number | null;
          idcliente?: number | null;
        };

        const vehiculo = row.idvehiculo ? vehiculosById.get(row.idvehiculo) : undefined;
        const marca = vehiculo?.idmarca ? marcasById.get(vehiculo.idmarca) : undefined;
        const clienteId = row.idcliente ?? vehiculo?.idcliente ?? null;
        const cliente = typeof clienteId === 'number' ? clientesById.get(clienteId) : undefined;

        return {
          id: row.id,
          fechaservicio: row.fechaservicio,
          kmservicio: row.kmservicio,
          calificacion: row.calificacion,
          clienteNombre: cliente ? `${cliente.apellidos}, ${cliente.nombres}` : null,
          clienteEmail: cliente?.email ?? null,
          Vehiculo: vehiculo
            ? {
                patente: vehiculo.patente,
                modelo: vehiculo.modelo ?? '',
                Marcas: { descripcion: marca?.descripcion ?? '' },
              }
            : null,
        };
      });

      setServicios(serviciosMapped);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || 'Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = (row: Servicio) => {
    const doc = new jsPDF();
    const vehiculo = row.Vehiculo;
    const marcaModelo = vehiculo ? `${vehiculo.Marcas?.descripcion ?? ''} ${vehiculo.modelo ?? ''}`.trim() : '—';
    const patente = vehiculo?.patente ?? '—';
    const fecha = row.fechaservicio ? dayjs(row.fechaservicio).format('DD/MM/YYYY') : '—';
    const km = typeof row.kmservicio === 'number' ? row.kmservicio.toLocaleString('es-AR') : '—';
    const cliente = row.clienteNombre ?? '—';

    doc.setFontSize(16);
    doc.text('RiderBross - Servicio Técnico', 14, 18);
    doc.setFontSize(11);
    doc.text(`Servicio #${row.id}`, 14, 28);
    doc.text(`Fecha: ${fecha}`, 14, 36);
    doc.text(`KM Actual: ${km}`, 14, 44);
    doc.text(`Vehículo: ${patente}`, 14, 52);
    doc.text(`Marca/Modelo: ${marcaModelo}`, 14, 60);
    doc.text(`Cliente: ${cliente}`, 14, 68);

    const safePatente = patente.replace(/[^a-zA-Z0-9_-]+/g, '_');
    doc.save(`servicio-${row.id}-${safePatente}.pdf`);
  };

  const sendEmail = (row: Servicio) => {
    const to = row.clienteEmail?.trim();
    if (!to) return;

    const vehiculo = row.Vehiculo;
    const patente = vehiculo?.patente ?? '—';
    const fecha = row.fechaservicio ? dayjs(row.fechaservicio).format('DD/MM/YYYY') : '—';
    const subject = encodeURIComponent(`RiderBross - Servicio ${patente} (${fecha})`);
    const body = encodeURIComponent(
      `Hola ${row.clienteNombre ?? ''}\n\n` +
        `Te enviamos el resumen del servicio.\n` +
        `- Servicio: #${row.id}\n` +
        `- Patente: ${patente}\n` +
        `- Fecha: ${fecha}\n\n` +
        `Saludos,\nRiderBross`
    );

    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
  };

  const columns: ColumnDef<Servicio>[] = [
    {
      accessorKey: 'Vehiculo.patente',
      header: 'Patente',
      cell: ({ row }) => {
        const vehiculo = row.original.Vehiculo;
        return vehiculo ? vehiculo.patente : 'N/A';
      },
    },
    {
      accessorKey: 'Vehiculo',
      header: 'Vehículo',
      cell: ({ row }) => {
        const vehiculo = row.original.Vehiculo;
        if (!vehiculo) return 'N/A';
        const marca = vehiculo.Marcas?.descripcion || '';
        return `${marca} ${vehiculo.modelo || ''}`.trim();
      },
    },
    {
      accessorKey: 'clienteNombre',
      header: 'Cliente',
      cell: ({ row }) => row.original.clienteNombre || '—',
    },
    {
      accessorKey: 'fechaservicio',
      header: 'Fecha',
      cell: ({ row }) => {
        const f = row.original.fechaservicio;
        return f ? dayjs(f).format('DD/MM/YYYY') : '—';
      },
    },
    {
      accessorKey: 'kmservicio',
      header: 'KM',
      cell: ({ row }) => {
        const km = row.original.kmservicio;
        return typeof km === 'number' ? km.toLocaleString('es-AR') : '—';
      },
    },
    {
      accessorKey: 'calificacion',
      header: 'Calificación',
      cell: ({ row }) => {
        const calificacion = row.original.calificacion;
        if (!calificacion) return 'N/A';
        return (
          <Chip
            label={`${calificacion}/5`}
            size="small"
            sx={{
              backgroundColor: calificacion >= 4 ? 'rgba(76, 175, 80, 0.2)' : calificacion >= 3 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)',
              color: calificacion >= 4 ? '#4caf50' : calificacion >= 3 ? '#ff9800' : '#f44336',
            }}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const hasEmail = Boolean(row.original.clienteEmail && row.original.clienteEmail.includes('@'));
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => {
                if (props?.onView) return props.onView(row.original.id);
              }}
              sx={{
                color: 'var(--primary)',
                '&:hover': {
                  backgroundColor: 'rgba(139, 26, 26, 0.1)',
                },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <Tooltip title={hasEmail ? 'Enviar por email' : 'Cliente sin email'}>
              <span>
                <IconButton
                  size="small"
                  disabled={!hasEmail}
                  onClick={() => sendEmail(row.original)}
                  sx={{
                    color: hasEmail ? 'var(--primary)' : 'rgba(255,255,255,0.35)',
                    '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.1)' },
                  }}
                >
                  <EmailIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Descargar PDF">
              <IconButton
                size="small"
                onClick={() => downloadPdf(row.original)}
                sx={{
                  color: 'var(--primary)',
                  '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.1)' },
                }}
              >
                <PictureAsPdfIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={() => {
                if (props?.onEdit) return props.onEdit(row.original.id);
              }}
              sx={{
                color: 'var(--text-secondary)',
                '&:hover': {
                  backgroundColor: 'rgba(139, 26, 26, 0.1)',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return <DataTable columns={columns} data={servicios} searchPlaceholder="Buscar por patente, vehículo o cliente..." />;
}

