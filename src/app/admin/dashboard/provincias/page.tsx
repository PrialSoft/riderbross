import { Box, Typography, Paper } from '@mui/material';
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
        <ProvinciasTable />
      </Paper>
    </Box>
  );
}


