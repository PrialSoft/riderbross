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
import { formatPatente } from '@/utils/patente';
import { supabase } from '@/lib/supabase/client';
import CustomButton from '@/utils/ui/button/CustomButton';

interface Vehiculo {
  id: number;
  patente: string;
  modelo: string | null;
  anio: string | null;
  kmactual: number;
  comentarioPrivado: string | null;
  marcas: {
    descripcion: string;
  } | null;
  clientes: {
    nombres: string;
    apellidos: string;
  } | null;
}

export function VehiculosTable(props?: {
  onEdit?: (id: number) => void;
  reloadToken?: number;
}) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehiculoToDelete, setVehiculoToDelete] = useState<Vehiculo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehiculos();
  }, [props?.reloadToken]);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('vehiculo')
        .select(`
          id,
          patente,
          modelo,
          anio,
          kmactual,
          "comentarioPrivado",
          marcas (
            descripcion
          ),
          clientes (
            nombres,
            apellidos
          )
        `)
        .order('patente', { ascending: true });

      if (fetchError) throw fetchError;

      // Mapear los datos para asegurar el tipo correcto
      const mappedVehiculos: Vehiculo[] = ((data as unknown[]) ?? []).map((row: any) => ({
        id: row.id,
        patente: row.patente,
        modelo: row.modelo ?? null,
        anio: row.anio ?? null,
        kmactual: row.kmactual ?? 0,
        comentarioPrivado: row.comentarioPrivado ?? null,
        marcas: Array.isArray(row.marcas) ? (row.marcas[0] ?? null) : (row.marcas ?? null),
        clientes: Array.isArray(row.clientes) ? (row.clientes[0] ?? null) : (row.clientes ?? null),
      }));

      setVehiculos(mappedVehiculos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (vehiculo: Vehiculo) => {
    setVehiculoToDelete(vehiculo);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!vehiculoToDelete) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/vehiculos/${vehiculoToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al eliminar el vehículo');
      }

      // Cerrar diálogo y recargar lista
      setDeleteDialogOpen(false);
      setVehiculoToDelete(null);
      fetchVehiculos();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el vehículo';
      setDeleteError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVehiculoToDelete(null);
    setDeleteError(null);
  };

  const columns: ColumnDef<Vehiculo>[] = [
    {
      accessorKey: 'patente',
      header: 'Dominio',
      cell: ({ row }) => {
        return formatPatente(row.original.patente);
      },
    },
    {
      accessorKey: 'marcas.descripcion',
      header: 'Marca',
      cell: ({ row }) => {
        return row.original.marcas?.descripcion || 'N/A';
      },
    },
    {
      accessorKey: 'modelo',
      header: 'Modelo',
      cell: ({ row }) => {
        return row.original.modelo || 'N/A';
      },
    },
    {
      accessorKey: 'anio',
      header: 'Año',
      cell: ({ row }) => {
        if (!row.original.anio) return 'N/A';
        return new Date(row.original.anio).getFullYear().toString();
      },
    },
    {
      accessorKey: 'kmactual',
      header: 'KM Actual',
      cell: ({ row }) => {
        return row.original.kmactual.toLocaleString('es-AR');
      },
    },
    {
      accessorKey: 'clientes',
      header: 'Cliente',
      cell: ({ row }) => {
        const cliente = row.original.clientes;
        if (!cliente) return 'N/A';
        return `${cliente.apellidos}, ${cliente.nombres} `;
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
      <DataTable columns={columns} data={vehiculos} searchPlaceholder="Buscar por patente, marca, modelo..." />
      
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
            ¿Está seguro que desea eliminar el vehículo con patente{' '}
            <strong>{vehiculoToDelete ? formatPatente(vehiculoToDelete.patente) : ''}</strong>?
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

