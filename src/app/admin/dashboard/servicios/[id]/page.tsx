import { Box, Paper, Typography, Stack, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';

export default async function ServicioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
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
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          sx={{
            backgroundColor: 'var(--primary)',
            color: 'var(--text-primary)',
            '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.9)' },
          }}
        >
          Imprimir (PDF)
        </Button>
        <Button
          variant="outlined"
          startIcon={<EmailIcon />}
          sx={{
            borderColor: 'rgba(139, 26, 26, 0.4)',
            color: 'var(--text-primary)',
            '&:hover': { borderColor: 'rgba(139, 26, 26, 0.7)' },
          }}
        >
          Enviar por Email
        </Button>
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
  );
}


