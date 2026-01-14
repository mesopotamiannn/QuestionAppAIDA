import React from 'react';
import styles from './CategoryChip.module.css';

interface CategoryChipProps {
    label: string;
    selected: boolean;
    isAdult?: boolean;
    onClick: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
    label,
    selected,
    isAdult = false,
    onClick,
}) => {
    return (
        <button
            type="button"
            className={`${styles.chip} ${selected ? styles.selected : ''} ${isAdult ? styles.adult : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
