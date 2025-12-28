import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MarcasTable } from '@/components/admin/MarcasTable/MarcasTable';

export default function MarcasPage() {
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
          Marcas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href="/admin/dashboard/marcas/nuevo"
          sx={{
            backgroundColor: 'var(--primary)',
            color: 'var(--text-primary)',
            '&:hover': {
              backgroundColor: 'rgba(139, 26, 26, 0.9)',
            },
            transition: 'all 0.5s ease',
          }}
        >
          Nueva Marca
        </Button>
      </Box>

      <MarcasTable />
    </Box>
  );
}


