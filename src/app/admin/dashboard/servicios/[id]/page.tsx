'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Paper, Typography, Stack, CircularProgress, Alert } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import CustomButton from '@/utils/ui/button/CustomButton';
import { EmailDialog } from '@/components/EmailDialog/EmailDialog';
import { generateServicePdf } from '@/utils/pdf/generateServicePdf';
import { supabase } from '@/lib/supabase/client';
import { formatPatente } from '@/utils/patente';

interface ServicioData {
  id: number;
  patente: string;
  clienteNombre: string | null;
  clienteEmail: string | null;
}

export default function ServicioDetallePage() {
  const params = useParams();
  const id = params?.id as string;
  const [servicioData, setServicioData] = useState<ServicioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchServicioData();
    }
  }, [id]);

  const fetchServicioData = async () => {
    try {
      setLoading(true);
      setError(null);

      const servicioId = parseInt(id, 10);
      if (isNaN(servicioId)) {
        throw new Error('ID de servicio inválido');
      }

      // Obtener servicio con vehículo y cliente
      const { data: servicio, error: servicioError } = await supabase
        .from('servicios')
        .select('id, idvehiculo, idcliente')
        .eq('id', servicioId)
        .single();

      if (servicioError || !servicio) {
        throw new Error('No se pudo obtener el servicio');
      }

      const vehiculoId = (servicio as { idvehiculo?: number | null }).idvehiculo;
      const clienteId = (servicio as { idcliente?: number | null }).idcliente;

      let patente = '';
      let clienteNombre: string | null = null;
      let clienteEmail: string | null = null;

      if (vehiculoId) {
        const { data: vehiculo } = await supabase
          .from('vehiculo')
          .select('patente, idcliente')
          .eq('id', vehiculoId)
          .single();

        if (vehiculo) {
          patente = vehiculo.patente || '';
          const clienteIdVehiculo = vehiculo.idcliente || clienteId;

          if (clienteIdVehiculo) {
            const { data: cliente } = await supabase
              .from('clientes')
              .select('nombres, apellidos, email')
              .eq('id', clienteIdVehiculo)
              .single();

            if (cliente) {
              clienteNombre = `${cliente.apellidos}, ${cliente.nombres}`;
              clienteEmail = cliente.email;
            }
          }
        }
      }

      setServicioData({
        id: servicioId,
        patente,
        clienteNombre,
        clienteEmail,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el servicio';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!servicioData) return;
    try {
      await generateServicePdf(servicioData.id);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
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

  if (!servicioData) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        No se encontró el servicio
      </Alert>
    );
  }

  return (
    <>
      <Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          Servicio #{id}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <CustomButton
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handleDownloadPdf}
          >
            Imprimir (PDF)
          </CustomButton>
          <CustomButton
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={() => setEmailDialogOpen(true)}
          >
            Enviar por Email
          </CustomButton>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            background:
              'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.15) 100%)',
            backdropFilter: 'blur(15px)',
            border: 'none',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-family-body)' }}
          >
            Próximo paso: vista detalle del servicio (vehículo, checklist, batería, válvulas, etc.) y acciones.
          </Typography>
        </Paper>
      </Box>

      <EmailDialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        servicioId={servicioData.id}
        patente={servicioData.patente}
        clienteNombre={servicioData.clienteNombre}
        clienteEmail={servicioData.clienteEmail}
      />
    </>
  );
}
