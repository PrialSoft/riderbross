import { Box, Typography } from '@mui/material';
import { ProvinciasTable } from '@/components/admin/ProvinciasTable/ProvinciasTable';

export default function ProvinciasPage() {
  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-family-body)',
        }}
      >
        Provincias
      </Typography>

      <ProvinciasTable />
    </Box>
  );
}


