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
  { label: 'MIS INFORMES', href: '/consulta' },
  { label: 'CONSEJOS', href: '/consejos' },
  { label: 'BLOG', href: '/blog' },
  { label: 'CONTACTO', href: '#contacto', isScroll: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPosition > 10);
    };

    // Verificar posición inicial
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Siempre intentar hacer scroll al footer en la página actual
    const footerElement = document.getElementById('contacto');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Solo si no hay footer en la página actual, redirigir a inicio
      window.location.href = '/#contacto';
      return;
    }
    
    // Cerrar drawer si está abierto
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} className={styles.drawer}>
      <Box className={styles.drawerHeader}>
        <Box className={styles.drawerLogoContainer}>
          <Image
            src="/images/Logo.png"
            alt="RiderBross Logo"
            width={120}
            height={40}
            priority
            className={styles.drawerLogoImage}
          />
        </Box>
        <IconButton 
          onClick={handleDrawerToggle}
          className={styles.drawerCloseButton}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List className={styles.drawerList}>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={item.isScroll ? 'a' : Link}
              href={item.href}
              onClick={item.isScroll ? handleContactClick : undefined}
              selected={pathname === item.href}
              className={styles.drawerListItemButton}
              classes={{ selected: styles.drawerListItemButtonSelected }}
            >
              <ListItemText 
                primary={item.label}
                classes={{ primary: styles.drawerListItemText }}
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
              className={styles.drawerListItemButton}
              classes={{ selected: styles.drawerListItemButtonSelected }}
            >
              <ListItemText 
                primary="PORTAL"
                classes={{ primary: styles.drawerListItemText }}
              />
            </ListItemButton>
          </ListItem>
        )}
        {!isAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/admin/login"
              className={styles.drawerLoginButton}
            >
              <ListItemText 
                primary="Iniciar Sesión"
                classes={{ primary: styles.drawerListItemTextBold }}
              />
            </ListItemButton>
          </ListItem>
        )}
        {isAdmin && (
          <ListItem disablePadding>
            <Box className={styles.drawerAdminLogoutContainer}>
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
        classes={{ root: `${styles.appBar} ${isScrolled ? styles.appBarScrolled : ''}` }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters 
            className={styles.toolbar}
            sx={{
              minHeight: {
                xs: isScrolled ? 90 : 110,
                sm: isScrolled ? 110 : 120,
              },
              px: {
                xs: 2,
                sm: 3,
              },
              transition: 'min-height 0.3s ease-in-out, padding 0.3s ease-in-out',
            }}
          >
            {/* Logo/Brand */}
            <Link
              href="/"
              className={styles.logoLink}
            >
              <Image
                src="/images/Logo.png"
                alt="RiderBross Logo"
                width={120}
                height={38}
                priority
                className={styles.logoImage}
              />
            </Link>

            {/* Desktop Navigation */}
            <Box className={styles.desktopNav}>
              {navItems.map((item) => (
                item.isScroll ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleContactClick}
                    className={`${styles.navLink} ${
                      pathname === item.href ? styles.navLinkActive : ''
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navLink} ${
                      pathname === item.href ? styles.navLinkActive : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                )
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
                  className={`${styles.navLink} ${styles.navLinkLogin}`}
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
              className={styles.mobileMenuButton}
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
          disableScrollLock: false,
        }}
        className={styles.drawerComponent}
        classes={{ paper: styles.drawerPaper }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
