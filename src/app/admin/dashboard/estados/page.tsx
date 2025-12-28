import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EstadosTable } from '@/components/admin/EstadosTable/EstadosTable';

export default function EstadosPage() {
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
          Estados
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href="/admin/dashboard/estados/nuevo"
          sx={{
            backgroundColor: 'var(--primary)',
            color: 'var(--text-primary)',
            '&:hover': {
              backgroundColor: 'rgba(139, 26, 26, 0.9)',
            },
            transition: 'all 0.5s ease',
          }}
        >
          Nuevo Estado
        </Button>
      </Box>

      <EstadosTable />
    </Box>
  );
}


