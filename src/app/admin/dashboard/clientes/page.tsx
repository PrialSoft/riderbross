import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ClientesTable } from '@/components/admin/ClientesTable/ClientesTable';

export default function ClientesPage() {
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
          sx={{
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href="/admin/dashboard/clientes/nuevo"
          sx={{
            backgroundColor: 'var(--primary)',
            color: 'var(--text-primary)',
            '&:hover': {
              backgroundColor: 'rgba(139, 26, 26, 0.9)',
            },
            transition: 'all 0.5s ease',
          }}
        >
          Nuevo Cliente
        </Button>
      </Box>

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
        <ClientesTable />
      </Paper>
    </Box>
  );
}


