import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomButton from '@/utils/ui/button/CustomButton';
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
        <CustomButton
          startIcon={<AddIcon />}
          href="/admin/dashboard/estados/nuevo"
        >
          Nuevo Estado
        </CustomButton>
      </Box>

      <EstadosTable />
    </Box>
  );
}


