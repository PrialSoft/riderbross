'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '@/lib/supabase/client';
import AdminLogoutButton from '@/components/AdminLogoutButton/AdminLogoutButton';
import styles from './Navbar.module.css';

const navItems = [
  { label: 'INICIO', href: '/' },
  { label: 'CONSULTAR PATENTE', href: '/consulta' },
  { label: 'CONSEJOS', href: '/consejos' },
  { label: 'BLOG', href: '/blog' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(!!user);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: '#040017', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 1rem',
          borderBottom: '2px solid rgba(139, 26, 26, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Image
            src="/images/Logo.png"
            alt="RiderBross Logo"
            width={120}
            height={40}
            priority
            style={{ 
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 6px rgba(139, 26, 26, 0.5)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))',
            }}
          />
        </Box>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ 
            color: 'var(--text-primary)',
            transition: 'all 0.5s ease',
            '&:hover': {
              backgroundColor: 'rgba(139, 26, 26, 0.2)',
              transform: 'rotate(90deg)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ py: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              sx={{
                py: 1.5,
                transition: 'all 0.5s ease',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(139, 26, 26, 0.15)',
                  color: 'var(--primary)',
                },
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  backgroundColor: 'rgba(139, 26, 26, 0.2)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(255, 255, 255, 0.2)',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {isAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/admin/dashboard"
              selected={pathname === '/admin/dashboard'}
              sx={{
                py: 1.5,
                transition: 'all 0.5s ease',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(139, 26, 26, 0.15)',
                  color: 'var(--primary)',
                },
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:hover': {
                  backgroundColor: 'rgba(139, 26, 26, 0.2)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemText 
                primary="PORTAL"
                primaryTypographyProps={{
                  sx: {
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(255, 255, 255, 0.2)',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
        {!isAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/admin/login"
              sx={{
                py: 1.5,
                transition: 'all 0.5s ease',
                backgroundColor: 'rgba(139, 26, 26, 0.2)',
                border: '1px solid rgba(139, 26, 26, 0.4)',
                mx: 1,
                borderRadius: 'var(--border-radius-md)',
                '&:hover': {
                  backgroundColor: 'rgba(139, 26, 26, 0.3)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemText 
                primary="Iniciar Sesión"
                primaryTypographyProps={{
                  sx: {
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(255, 255, 255, 0.2)',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
        {isAdmin && (
          <ListItem disablePadding>
            <Box sx={{ width: '100%', px: 2, py: 1 }}>
              <AdminLogoutButton />
            </Box>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        suppressHydrationWarning
        sx={{
          backgroundColor: '#040017',
          backgroundImage: 'none',
          color: 'var(--text-primary)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          borderBottom: 'none',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(to right, transparent 0%, rgba(139, 26, 26, 0.3) 15%, rgba(139, 26, 26, 0.6) 30%, rgba(139, 26, 26, 0.8) 50%, rgba(139, 26, 26, 0.6) 70%, rgba(139, 26, 26, 0.3) 85%, transparent 100%)',
            boxShadow: '0 0 8px rgba(139, 26, 26, 0.4)',
          },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters 
            sx={{ 
              minHeight: { xs: '64px', sm: '72px' },
              px: { xs: 2, sm: 3 },
            }}
          >
            {/* Logo/Brand */}
            <Box
              component={Link}
              href="/"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mr: { md: 4 },
              }}
            >
              <Image
                src="/images/Logo.png"
                alt="RiderBross Logo"
                width={140}
                height={45}
                priority
                style={{ 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 6px rgba(139, 26, 26, 0.5)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))',
                  transition: 'all 0.5s ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 4px 10px rgba(139, 26, 26, 0.7)) drop-shadow(0 0 14px rgba(255, 255, 255, 0.4))';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 2px 6px rgba(139, 26, 26, 0.5)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: { md: 0.5, lg: 1 },
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${
                    pathname === item.href ? styles.navLinkActive : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className={`${styles.navLink} ${
                    pathname === '/admin/dashboard' ? styles.navLinkActive : ''
                  }`}
                >
                  PORTAL
                </Link>
              )}
              {!isAdmin && (
                <Link
                  href="/admin/login"
                  className={styles.navLink}
                  style={{
                    backgroundColor: 'rgba(139, 26, 26, 0.2)',
                    border: '1px solid rgba(139, 26, 26, 0.4)',
                  }}
                >
                  Iniciar Sesión
                </Link>
              )}
              {isAdmin && (
                <AdminLogoutButton />
              )}
            </Box>

            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { md: 'none' }, 
                color: 'var(--text-primary)',
                transition: 'all 0.5s ease',
                '&:hover': {
                  backgroundColor: 'rgba(139, 26, 26, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: '#040017',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

