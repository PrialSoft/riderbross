'use client';

import { useCallback, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '@/lib/supabase/client';
import { TiposServicioTable } from '@/components/admin/TiposServicioTable/TiposServicioTable';
import TipoServicioForm from '@/components/admin/TipoServicioForm/TipoServicioForm';

type TipoServicioInitial = {
  id: number;
  nombre: string;
  referencia: string | null;
  idcategoriaservicio: number | null;
};

export default function TiposServicioManager() {
  const [reloadToken, setReloadToken] = useState(0);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [initial, setInitial] = useState<TipoServicioInitial | undefined>(undefined);

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

    const { data, error } = await supabase
      .from('tiposservicio')
      .select('id, nombre, referencia, idcategoriaservicio')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      close();
      return;
    }

    setInitial(data as TipoServicioInitial);
  }, [close]);

  const title = useMemo(
    () => (mode === 'create' ? 'Nuevo Tipo de Servicio' : 'Editar Tipo de Servicio'),
    [mode]
  );

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
          Tipos de Servicio
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
          Nuevo Tipo
        </Button>
      </Box>

      <TiposServicioTable onEdit={openEdit} reloadToken={reloadToken} />

      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="md"
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
            <TipoServicioForm mode="create" onSuccess={onSaved} />
          ) : (
            initial && <TipoServicioForm mode="edit" initial={initial} onSuccess={onSaved} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}


