'use client';

import { useEffect, useState } from 'react';
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

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: number | null;
  dni: number;
  localidad: string | null;
  provincias: {
    descripcion: string;
  } | null;
}

export function ClientesTable(props?: {
  onEdit?: (id: number) => void;
  reloadToken?: number;
}) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientes();
  }, [props?.reloadToken]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('clientes')
        .select(`
          id,
          nombres,
          apellidos,
          email,
          telefono,
          dni,
          localidad,
          provincias (
            descripcion
          )
        `)
        .order('apellidos', { ascending: true });

      if (fetchError) throw fetchError;

      setClientes(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: 'apellidos',
      header: 'Apellidos',
    },
    {
      accessorKey: 'nombres',
      header: 'Nombres',
    },
    {
      accessorKey: 'dni',
      header: 'DNI',
      cell: ({ row }) => {
        return row.original.dni.toLocaleString('es-AR');
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
      cell: ({ row }) => {
        return row.original.telefono ? row.original.telefono.toString() : 'N/A';
      },
    },
    {
      accessorKey: 'localidad',
      header: 'Localidad',
      cell: ({ row }) => {
        return row.original.localidad || 'N/A';
      },
    },
    {
      accessorKey: 'provincias.descripcion',
      header: 'Provincia',
      cell: ({ row }) => {
        return row.original.provincias?.descripcion || 'N/A';
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
              onClick={() => {
                if (props?.onEdit) return props.onEdit(row.original.id);
              }}
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

  return <DataTable columns={columns} data={clientes} searchPlaceholder="Buscar por nombre, apellido, DNI, email..." />;
}

