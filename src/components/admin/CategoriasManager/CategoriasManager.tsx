'use client';

import { useCallback, useMemo, useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CustomButton from '@/utils/ui/button/CustomButton';
import { supabase } from '@/lib/supabase/client';
import { CategoriasTable } from '@/components/admin/CategoriasTable/CategoriasTable';
import CategoriaForm from '@/components/admin/CategoriaForm/CategoriaForm';
import { deleteCategoria } from '@/app/admin/dashboard/categorias/actions';

type CategoriaInitial = {
  id: number;
  nombre: string;
};

export default function CategoriasManager() {
  const [reloadToken, setReloadToken] = useState(0);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [initial, setInitial] = useState<CategoriaInitial | undefined>(undefined);

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
      .from('categoriasservicio')
      .select('id, nombre')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      close();
      return;
    }

    setInitial(data as CategoriaInitial);
  }, [close]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }

    try {
      await deleteCategoria(id);
      setReloadToken((t) => t + 1);
    } catch (error) {
      const err = error as { message?: string };
      alert(err?.message || 'No se pudo eliminar la categoría');
    }
  }, []);

  const title = useMemo(
    () => (mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'),
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
          Categorías de Servicio
        </Typography>
        <CustomButton
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Nueva Categoría
        </CustomButton>
      </Box>

      <CategoriasTable onEdit={openEdit} onDelete={handleDelete} reloadToken={reloadToken} />

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
            <CategoriaForm mode="create" onSuccess={onSaved} />
          ) : (
            initial && <CategoriaForm mode="edit" initial={initial} onSuccess={onSaved} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

