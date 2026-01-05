import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomButton from '@/utils/ui/button/CustomButton';
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
        <CustomButton
          startIcon={<AddIcon />}
          href="/admin/dashboard/marcas/nuevo"
        >
          Nueva Marca
        </CustomButton>
      </Box>

      <MarcasTable />
    </Box>
  );
}


