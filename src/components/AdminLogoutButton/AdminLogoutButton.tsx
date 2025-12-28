'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '@/lib/supabase/client';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <Button
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
      sx={{
        color: 'var(--text-primary)',
        '&:hover': {
          backgroundColor: 'rgba(139, 26, 26, 0.1)',
        },
        transition: 'all 0.5s ease',
      }}
    >
      Cerrar Sesión
    </Button>
  );
}

