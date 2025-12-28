'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Dashboard as DashboardIcon,
  Build as ServiciosIcon,
  People as ClientesIcon,
  TwoWheeler as VehiculosIcon,
  Category as MarcasIcon,
  LocationOn as ProvinciasIcon,
  CheckCircle as EstadosIcon,
} from '@mui/icons-material';
import styles from './DashboardShell.module.css';

const drawerWidth = 280;

const menuItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: DashboardIcon },
  { label: 'Servicios', href: '/admin/dashboard/servicios', icon: ServiciosIcon },
  { label: 'Clientes', href: '/admin/dashboard/clientes', icon: ClientesIcon },
  { label: 'Vehículos', href: '/admin/dashboard/vehiculos', icon: VehiculosIcon },
  { label: 'Marcas', href: '/admin/dashboard/marcas', icon: MarcasIcon },
  { label: 'Provincias', href: '/admin/dashboard/provincias', icon: ProvinciasIcon },
  { label: 'Estados', href: '/admin/dashboard/estados', icon: EstadosIcon },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Altura del Navbar global (RootLayout). El Drawer es fixed y si no lo offseteamos,
  // el primer ítem queda tapado por el Navbar.
  const topOffset = { xs: 64, sm: 72 };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          minHeight: '72px !important',
          backgroundColor: 'rgba(139, 26, 26, 0.1)',
          borderBottom: '1px solid rgba(139, 26, 26, 0.2)',
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          Portal Admin
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(139, 26, 26, 0.2)' }} />
      <List sx={{ py: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(item.href);
                  setMobileOpen(false);
                }}
                selected={isActive}
                sx={{
                  py: 1.5,
                  px: 3,
                  transition: 'all 0.5s ease',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(139, 26, 26, 0.2)',
                    color: 'var(--primary)',
                    borderLeft: '3px solid var(--primary)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 26, 26, 0.25)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(139, 26, 26, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: isActive ? 700 : 500,
                      fontFamily: 'var(--font-family-body)',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              top: topOffset,
              height: { xs: 'calc(100% - 64px)', sm: 'calc(100% - 72px)' },
              overflowY: 'auto',
              backgroundColor: '#040017',
              borderRight: '1px solid rgba(139, 26, 26, 0.2)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              top: topOffset,
              height: { xs: 'calc(100% - 64px)', sm: 'calc(100% - 72px)' },
              overflowY: 'auto',
              backgroundColor: '#040017',
              borderRight: '1px solid rgba(139, 26, 26, 0.2)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
        className={styles.mainContent}
      >
        {/* Barra móvil para abrir/cerrar el sidebar (debajo del Navbar global) */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1,
            position: 'sticky',
            top: topOffset,
            zIndex: 2,
            mb: 2,
            px: 1,
            py: 1,
            backgroundColor: 'rgba(4, 0, 23, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid rgba(139, 26, 26, 0.2)',
          }}
        >
          <IconButton
            aria-label="Abrir menú del portal"
            onClick={handleDrawerToggle}
            sx={{
              color: 'var(--text-primary)',
              transition: 'all 0.5s ease',
              '&:hover': {
                backgroundColor: 'rgba(139, 26, 26, 0.15)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-body)',
            }}
          >
            Portal de Administración
          </Typography>
        </Box>

        {children}
      </Box>
    </Box>
  );
}


