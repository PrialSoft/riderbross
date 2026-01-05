'use client';

import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '@/lib/supabase/client';
import CustomButton from '@/utils/ui/button/CustomButton';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <CustomButton
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
      variant="text"
      color="white"
    >
      Cerrar Sesión
    </CustomButton>
  );
}

