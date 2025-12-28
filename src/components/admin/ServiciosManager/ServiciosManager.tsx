'use client';

import { useCallback, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '@/lib/supabase/client';
import { ServiciosTable } from '@/components/admin/ServiciosTable/ServiciosTable';
import ServicioForm from '@/components/admin/ServicioForm/ServicioForm';

type ServicioInitial = {
  id: number;
  idvehiculo: number;
  fechaservicio: string;
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

export default function ServiciosManager() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [reloadToken, setReloadToken] = useState(0);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [initial, setInitial] = useState<ServicioInitial | undefined>(undefined);

  const close = useCallback(() => {
    setOpen(false);
    setInitial(undefined);
  }, []);

  const onSaved = useCallback(() => {
    close();
    setReloadToken((t) => t + 1);
  }, [close]);

  const openCreate = useCallback(() => {
    setMode('create');
    setInitial(undefined);
    setOpen(true);
  }, []);

  const openEdit = useCallback(async (id: number) => {
    setMode('edit');
    setOpen(true);

    const [{ data, error }, { data: detalles, error: detErr }] = await Promise.all([
      supabase
        .from('servicios')
        .select('id, idvehiculo, fechaservicio, kmservicio, calificacion, comentario, fotoservicio')
        .eq('id', id)
        .maybeSingle(),
      supabase
        .from('detallesservicio')
        .select('id, idtiposervicio, proximoenkm, comentario, idestado, recomendacion')
        .eq('idservicio', id)
        .order('id', { ascending: true }),
    ]);

    if (error || !data) {
      close();
      return;
    }

    // Si DetallesServicio aún no existe en la DB, no bloqueamos la edición del servicio.
    const detallesSafe = detErr ? [] : ((detalles as ServicioInitial['detalles']) ?? []);

    setInitial({ ...(data as ServicioInitial), detalles: detallesSafe });
  }, [close]);

  const title = useMemo(() => (mode === 'create' ? 'Nuevo Servicio' : 'Editar Servicio'), [mode]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-family-body)' }}
        >
          Servicios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{
            backgroundColor: 'var(--primary)',
            color: 'var(--text-primary)',
            '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.9)' },
            transition: 'all 0.5s ease',
          }}
        >
          Nuevo Servicio
        </Button>
      </Box>

      <ServiciosTable onEdit={openEdit} reloadToken={reloadToken} />

      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="lg"
        fullScreen={fullScreen}
        scroll="paper"
        PaperProps={{
          sx: {
            backgroundColor: '#040017',
            border: '1px solid rgba(139, 26, 26, 0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          {title}
          <IconButton onClick={close} sx={{ color: 'var(--text-secondary)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(139, 26, 26, 0.2)' }}>
          {mode === 'create' ? (
            <ServicioForm mode="create" onSuccess={onSaved} />
          ) : (
            initial && <ServicioForm mode="edit" initial={initial} onSuccess={onSaved} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}


