import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${disabled ? styles.disabled : ''} ${className}`}
            disabled={disabled}
            style={{ width: fullWidth ? '100%' : undefined }}
            {...props}
        >
            {children}
        </button>
    );
};
