'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable } from '@/utils/ui/table/DataTable';
import { supabase } from '@/lib/supabase/client';
import CustomButton from '@/utils/ui/button/CustomButton';

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: number | null;
  localidad: string | null;
  comentarioPrivado: string | null;
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
          localidad,
          "comentarioPrivado",
          provincias (
            descripcion
          )
        `)
        .order('apellidos', { ascending: true });

      if (fetchError) throw fetchError;

      // Mapear los datos para asegurar que provincias sea un objeto o null
      const clientesMapped: Cliente[] = (data || []).map((c: {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        telefono: number | null;
        localidad: string | null;
        comentarioPrivado: string | null;
        provincias: { descripcion: string } | { descripcion: string }[] | null;
      }): Cliente => {
        let provinciasNormalized: { descripcion: string } | null = null;
        if (Array.isArray(c.provincias) && c.provincias.length > 0) {
          provinciasNormalized = c.provincias[0];
        } else if (c.provincias && !Array.isArray(c.provincias)) {
          provinciasNormalized = c.provincias;
        }

        return {
          id: c.id,
          nombres: c.nombres,
          apellidos: c.apellidos,
          email: c.email,
          telefono: c.telefono,
          localidad: c.localidad,
          comentarioPrivado: c.comentarioPrivado,
          provincias: provinciasNormalized,
        };
      });

      setClientes(clientesMapped);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar clientes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!clienteToDelete) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/clientes/${clienteToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al eliminar el cliente');
      }

      // Cerrar diálogo y recargar lista
      setDeleteDialogOpen(false);
      setClienteToDelete(null);
      fetchClientes();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el cliente';
      setDeleteError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setClienteToDelete(null);
    setDeleteError(null);
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
      accessorKey: 'comentarioPrivado',
      header: 'Comentario Privado',
      cell: ({ row }) => {
        return row.original.comentarioPrivado || 'N/A';
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                onClick={() => {
                  if (props?.onEdit) return props.onEdit(row.original.id);
                }}
                sx={{
                  color: 'var(--text-primary)',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 26, 26, 0.1)',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(row.original)}
                sx={{
                  color: 'var(--text-primary)',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
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

  return (
    <>
      <DataTable columns={columns} data={clientes} searchPlaceholder="Buscar por nombre, apellido, email..." />
      
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            p: { xs: 2, md: 3 },
            background:
              'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.15) 100%)',
            backdropFilter: 'blur(15px)',
            border: 'none',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 0,
            mb: 2,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ p: 0, mb: 2 }}>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <DialogContentText sx={{ color: 'var(--text-secondary)' }}>
            ¿Está seguro que desea eliminar al cliente{' '}
            <strong>
              {clienteToDelete?.apellidos}, {clienteToDelete?.nombres}
            </strong>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 0, mt: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            disabled={deleting}
            sx={{ color: 'var(--text-secondary)' }}
          >
            Cancelar
          </Button>
          <CustomButton
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : undefined}
            sx={{
              backgroundColor: 'rgb(244, 67, 54)',
              '&:hover': {
                backgroundColor: 'rgb(198, 40, 40)',
              },
            }}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

