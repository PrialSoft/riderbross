'use client';

import { useCallback, useMemo, useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CustomButton from '@/utils/ui/button/CustomButton';
import { supabase } from '@/lib/supabase/client';
import { VehiculosTable } from '@/components/admin/VehiculosTable/VehiculosTable';
import VehiculoForm from '@/components/admin/VehiculoForm/VehiculoForm';

type VehiculoInitial = {
  id: number;
  patente: string;
  idmarca: number | null;
  modelo: string | null;
  anio: string | null;
  kmactual: number | null;
  idcliente: number | null;
  comentarioPrivado?: string | null;
};

export default function VehiculosManager() {
  const [reloadToken, setReloadToken] = useState(0);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [initial, setInitial] = useState<VehiculoInitial | undefined>(undefined);

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
      .from('vehiculo')
      .select('id, patente, idmarca, modelo, anio, kmactual, idcliente, "comentarioPrivado"')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      close();
      return;
    }

    setInitial(data as VehiculoInitial);
  }, [close]);

  const title = useMemo(() => (mode === 'create' ? 'Nuevo Vehículo' : 'Editar Vehículo'), [mode]);

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
          Vehículos
        </Typography>
        <CustomButton
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Nuevo Vehículo
        </CustomButton>
      </Box>

      <VehiculosTable onEdit={openEdit} reloadToken={reloadToken} />

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
          <IconButton onClick={close} sx={{ color: 'var(--text-primary)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(139, 26, 26, 0.2)' }}>
          {mode === 'create' ? (
            <VehiculoForm mode="create" onSuccess={onSaved} />
          ) : (
            initial && <VehiculoForm mode="edit" initial={initial} onSuccess={onSaved} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}


