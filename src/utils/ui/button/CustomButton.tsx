'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import styles from './CustomButton.module.css';

interface CustomButtonProps extends Omit<ButtonProps, 'classes' | 'size' | 'fullWidth' | 'color'> {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'white';
  isLoading?: boolean;
  width?: string;
  icon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: 'small' | 'mid' | 'large'; 
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  isLoading = false,
  width,
  className = '',
  disabled = false,
  icon,
  startIcon,
  endIcon,
  size = 'mid',
  fullWidth = false,
  ...props
}) => {
  const sizeClass = {
    small: styles.small,
    mid: styles.mid,
    large: styles.large,
  };
  
  const colorClass = {
    primary: styles.primary,
    secondary: styles.secondary,
    error: styles.error,
    white: styles.white,
  };
  
  const baseColorClass = colorClass[color] || styles.primary; 

  const variantClass = variant === 'outlined' ? styles.outlined : variant === 'text' ? styles.text : '';
  
  return (
    <Button
      variant={variant}
      classes={{
        root: `${styles.customButton} ${baseColorClass} ${variantClass} ${disabled || isLoading ? styles.disabled : ''} ${sizeClass[size]}`,
      }}
      className={className}
      disabled={disabled || isLoading}
      style={{ width: fullWidth ? '100%' : (width || 'fit-content') }}
      {...props}
    >
      {isLoading ? (
        <span className={styles.loadingText}>CARGANDO...</span>
      ) : (
        <div className={styles.contentWrapper}>
          {(icon || startIcon) && <span className={styles.iconWrapper}>{icon || startIcon}</span>}
          {children}
          {endIcon && <span className={styles.iconWrapper}>{endIcon}</span>}
        </div>
      )}
    </Button>
  );
};

export default CustomButton;

