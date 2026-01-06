'use client';

import { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Alert, Box, CircularProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable } from '@/utils/ui/table/DataTable';
import { supabase } from '@/lib/supabase/client';

type CategoriaRow = {
  id: number;
  nombre: string;
};

export function CategoriasTable(props?: {
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  reloadToken?: number;
}) {
  const [data, setData] = useState<CategoriaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: rows, error: qErr } = await supabase
          .from('categoriasservicio')
          .select('id, nombre')
          .order('nombre', { ascending: true });

        if (qErr) throw qErr;

        setData((rows as CategoriaRow[]) ?? []);
      } catch (e: unknown) {
        const err = e as { message?: string };
        setError(err?.message || 'Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [props?.reloadToken]);

  const columns = useMemo<ColumnDef<CategoriaRow>[]>(
    () => [
      { accessorKey: 'nombre', header: 'Nombre' },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => {
                if (props?.onEdit) return props.onEdit(row.original.id);
              }}
              sx={{
                color: 'var(--text-primary)',
                '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.1)' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                if (props?.onDelete) return props.onDelete(row.original.id);
              }}
              sx={{
                color: 'var(--text-primary)',
                '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.1)' },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [props?.onEdit, props?.onDelete]
  );

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

  return <DataTable columns={columns} data={data} searchPlaceholder="Buscar por nombre..." />;
}

