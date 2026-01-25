'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  TwoWheeler as MotosIcon,
  Description as FichasIcon,
  People as ClientesIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import VehiculoForm from '@/components/admin/VehiculoForm/VehiculoForm';
import ServicioForm from '@/components/admin/ServicioForm/ServicioForm';
import ClienteForm from '@/components/admin/ClienteForm/ClienteForm';

interface DashboardCardsProps {
  vehiculosCount: number;
  serviciosCount: number;
  clientesCount: number;
}

export default function DashboardCards({ vehiculosCount, serviciosCount, clientesCount }: DashboardCardsProps) {
  const [vehiculoDialogOpen, setVehiculoDialogOpen] = useState(false);
  const [servicioDialogOpen, setServicioDialogOpen] = useState(false);
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false);

  const handleVehiculoClose = useCallback(() => {
    setVehiculoDialogOpen(false);
  }, []);

  const handleServicioClose = useCallback(() => {
    setServicioDialogOpen(false);
  }, []);

  const handleClienteClose = useCallback(() => {
    setClienteDialogOpen(false);
  }, []);

  const handleVehiculoSuccess = useCallback(() => {
    setVehiculoDialogOpen(false);
    window.location.reload(); // Recargar para actualizar los contadores
  }, []);

  const handleServicioSuccess = useCallback(() => {
    setServicioDialogOpen(false);
    window.location.reload(); // Recargar para actualizar los contadores
  }, []);

  const handleClienteSuccess = useCallback(() => {
    setClienteDialogOpen(false);
    window.location.reload(); // Recargar para actualizar los contadores
  }, []);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
        }}
      >
        {/* Card Vehículos */}
        <Box
          sx={{
            flex: {
              xs: '1 1 100%',
              sm: '1 1 calc(50% - 12px)',
              md: '1 1 calc(33.333% - 16px)',
            },
          }}
        >
          <Card
            sx={{
              background:
                'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.9) 50%, rgba(44, 62, 80, 0.15) 100%)',
              backdropFilter: 'blur(15px)',
              border: 'none',
              boxShadow:
                '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 26, 26, 0.1)',
              transition: 'all 0.5s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow:
                  '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 26, 26, 0.2)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <MotosIcon sx={{ fontSize: 48, color: 'var(--text-primary)', mr: 2 }} />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-family-body)',
                      }}
                    >
                      {vehiculosCount || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-family-body)',
                      }}
                    >
                      Vehículos
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setVehiculoDialogOpen(true)}
                  sx={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'rgba(139, 26, 26, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 26, 26, 0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  aria-label="Agregar vehículo"
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Card Servicios */}
        <Box
          sx={{
            flex: {
              xs: '1 1 100%',
              sm: '1 1 calc(50% - 12px)',
              md: '1 1 calc(33.333% - 16px)',
            },
          }}
        >
          <Card
            sx={{
              background:
                'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.9) 50%, rgba(44, 62, 80, 0.15) 100%)',
              backdropFilter: 'blur(15px)',
              border: 'none',
              boxShadow:
                '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 26, 26, 0.1)',
              transition: 'all 0.5s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow:
                  '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 26, 26, 0.2)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <FichasIcon sx={{ fontSize: 48, color: 'var(--text-primary)', mr: 2 }} />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-family-body)',
                      }}
                    >
                      {serviciosCount || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-family-body)',
                      }}
                    >
                      Servicios
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setServicioDialogOpen(true)}
                  sx={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'rgba(139, 26, 26, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 26, 26, 0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  aria-label="Agregar servicio"
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Card Clientes */}
        <Box
          sx={{
            flex: {
              xs: '1 1 100%',
              sm: '1 1 calc(50% - 12px)',
              md: '1 1 calc(33.333% - 16px)',
            },
          }}
        >
          <Card
            sx={{
              background:
                'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.9) 50%, rgba(44, 62, 80, 0.15) 100%)',
              backdropFilter: 'blur(15px)',
              border: 'none',
              boxShadow:
                '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 26, 26, 0.1)',
              transition: 'all 0.5s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow:
                  '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 26, 26, 0.2)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <ClientesIcon
                    sx={{ fontSize: 48, color: 'var(--text-primary)', mr: 2 }}
                  />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-family-body)',
                      }}
                    >
                      {clientesCount || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-family-body)',
                      }}
                    >
                      Clientes
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setClienteDialogOpen(true)}
                  sx={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'rgba(139, 26, 26, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 26, 26, 0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  aria-label="Agregar cliente"
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Dialog Vehículo */}
      <Dialog
        open={vehiculoDialogOpen}
        onClose={handleVehiculoClose}
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
          Nuevo Vehículo
          <IconButton onClick={handleVehiculoClose} sx={{ color: 'var(--text-primary)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(139, 26, 26, 0.2)' }}>
          <VehiculoForm mode="create" onSuccess={handleVehiculoSuccess} />
        </DialogContent>
      </Dialog>

      {/* Dialog Servicio */}
      <Dialog
        open={servicioDialogOpen}
        onClose={handleServicioClose}
        fullWidth
        maxWidth="lg"
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
          Nuevo Servicio
          <IconButton onClick={handleServicioClose} sx={{ color: 'var(--text-primary)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(139, 26, 26, 0.2)' }}>
          <ServicioForm mode="create" onSuccess={handleServicioSuccess} />
        </DialogContent>
      </Dialog>

      {/* Dialog Cliente */}
      <Dialog
        open={clienteDialogOpen}
        onClose={handleClienteClose}
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
          Nuevo Cliente
          <IconButton onClick={handleClienteClose} sx={{ color: 'var(--text-primary)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(139, 26, 26, 0.2)' }}>
          <ClienteForm mode="create" onSuccess={handleClienteSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}

