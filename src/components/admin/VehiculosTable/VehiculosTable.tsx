'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  Box,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { DataTable } from '@/utils/ui/table/DataTable';
import { supabase } from '@/lib/supabase/client';

interface Vehiculo {
  id: number;
  patente: string;
  modelo: string | null;
  anio: string | null;
  kmactual: number;
  marcas: {
    descripcion: string;
  } | null;
  clientes: {
    nombres: string;
    apellidos: string;
  } | null;
}

export function VehiculosTable() {
  const router = useRouter();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('vehiculo')
        .select(`
          id,
          patente,
          modelo,
          anio,
          kmactual,
          marcas (
            descripcion
          ),
          clientes (
            nombres,
            apellidos
          )
        `)
        .order('patente', { ascending: true });

      if (fetchError) throw fetchError;

      setVehiculos(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<Vehiculo>[] = [
    {
      accessorKey: 'patente',
      header: 'Patente',
    },
    {
      accessorKey: 'marcas.descripcion',
      header: 'Marca',
      cell: ({ row }) => {
        return row.original.marcas?.descripcion || 'N/A';
      },
    },
    {
      accessorKey: 'modelo',
      header: 'Modelo',
      cell: ({ row }) => {
        return row.original.modelo || 'N/A';
      },
    },
    {
      accessorKey: 'anio',
      header: 'Año',
      cell: ({ row }) => {
        if (!row.original.anio) return 'N/A';
        return new Date(row.original.anio).getFullYear().toString();
      },
    },
    {
      accessorKey: 'kmactual',
      header: 'KM Actual',
      cell: ({ row }) => {
        return row.original.kmactual.toLocaleString('es-AR');
      },
    },
    {
      accessorKey: 'clientes',
      header: 'Cliente',
      cell: ({ row }) => {
        const cliente = row.original.clientes;
        if (!cliente) return 'N/A';
        return `${cliente.nombres} ${cliente.apellidos}`;
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => router.push(`/admin/dashboard/vehiculos/${row.original.id}/editar`)}
              sx={{
                color: 'var(--primary)',
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

  return <DataTable columns={columns} data={vehiculos} searchPlaceholder="Buscar por patente, marca, modelo..." />;
}

