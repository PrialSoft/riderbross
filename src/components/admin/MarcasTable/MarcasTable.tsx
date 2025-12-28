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

interface Marca {
  id: number;
  descripcion: string;
}

export function MarcasTable() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('marcas')
        .select('*')
        .order('descripcion', { ascending: true });

      if (fetchError) throw fetchError;

      setMarcas(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar marcas');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<Marca>[] = [
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
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
                // TODO: Implementar edición
                console.log('Editar marca:', row.original.id);
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

  return <DataTable columns={columns} data={marcas} searchPlaceholder="Buscar marca..." />;
}

