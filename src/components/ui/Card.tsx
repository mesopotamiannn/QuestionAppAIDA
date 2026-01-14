import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    active?: boolean;
    interactive?: boolean;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    active = false,
    interactive = false,
    className = '',
    onClick
}) => {
    return (
        <div
            className={`${styles.card} ${active ? styles.active : ''} ${interactive ? styles.interactive : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
