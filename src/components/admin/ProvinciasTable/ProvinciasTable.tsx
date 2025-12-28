'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataTable } from '@/utils/ui/table/DataTable';
import { supabase } from '@/lib/supabase/client';

interface Provincia {
  id: number;
  descripcion: string;
}

export function ProvinciasTable() {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProvincias();
  }, []);

  const fetchProvincias = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('provincias')
        .select('*')
        .order('descripcion', { ascending: true });

      if (fetchError) throw fetchError;

      setProvincias(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar provincias');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<Provincia>[] = [
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
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

  return <DataTable columns={columns} data={provincias} searchPlaceholder="Buscar provincia..." />;
}

