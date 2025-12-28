'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { supabase } from '@/lib/supabase/client';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar si ya está autenticado al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Usar window.location para forzar redirección completa
        window.location.replace('/admin/dashboard');
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Error al iniciar sesión');
        setLoading(false);
        return;
      }

      if (data.user) {
        // Esperar un momento para que las cookies se establezcan correctamente
        await new Promise(resolve => setTimeout(resolve, 300));
        // Refrescar el router para que detecte el cambio de autenticación
        router.refresh();
        // Redirigir al dashboard
        router.push('/admin/dashboard');
        // Si después de 1 segundo aún no se redirigió, forzar con window.location
        setTimeout(() => {
          if (window.location.pathname === '/admin/login') {
            window.location.replace('/admin/dashboard');
          }
        }, 1000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <Box className={styles.pageWrapper}>
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              width: '100%',
              background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.2) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.2) 100%)',
              backdropFilter: 'blur(15px)',
              border: 'none',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 3,
                textAlign: 'center',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-family-body)',
              }}
            >
              Panel de Administración
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(139, 26, 26, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 26, 26, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--primary)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--text-secondary)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'var(--primary)',
                  },
                }}
                inputProps={{
                  style: { color: 'var(--text-primary)' },
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(139, 26, 26, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 26, 26, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--primary)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--text-secondary)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'var(--primary)',
                  },
                }}
                inputProps={{
                  style: { color: 'var(--text-primary)' },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-primary)',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 26, 26, 0.9)',
                  },
                  transition: 'all 0.5s ease',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

