'use client';

import { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Alert, Box, CircularProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { DataTable } from '@/utils/ui/table/DataTable';
import { supabase } from '@/lib/supabase/client';

type TipoServicioRow = {
  id: number;
  nombre: string;
  referencia: string | null;
  idcategoriaservicio: number | null;
  categoriasservicio?: { nombre: string } | null;
};

export function TiposServicioTable(props?: { onEdit?: (id: number) => void; reloadToken?: number }) {
  const [data, setData] = useState<TipoServicioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        // Si la relación está bien, esto devuelve categoriasservicio.nombre.
        // Si no, igual seguimos con lo básico.
        const { data: rows, error: qErr } = await supabase
          .from('tiposservicio')
          .select(
            `
            id,
            nombre,
            referencia,
            idcategoriaservicio,
            categoriasservicio ( nombre )
          `
          )
          .order('nombre', { ascending: true });

        if (qErr) throw qErr;
        setData((rows as TipoServicioRow[]) ?? []);
      } catch (e: unknown) {
        const err = e as { message?: string };
        setError(err?.message || 'Error al cargar tipos de servicio');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [props?.reloadToken]);

  const columns = useMemo<ColumnDef<TipoServicioRow>[]>(
    () => [
      { accessorKey: 'nombre', header: 'Nombre' },
      {
        accessorKey: 'categoriasservicio.nombre',
        header: 'Categoría',
        cell: ({ row }) => row.original.categoriasservicio?.nombre || '—',
      },
      {
        accessorKey: 'referencia',
        header: 'Referencia',
        cell: ({ row }) => row.original.referencia || '—',
      },
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
                color: 'var(--primary)',
                '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.1)' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [props?.onEdit]
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

  return <DataTable columns={columns} data={data} searchPlaceholder="Buscar por nombre o categoría..." />;
}


