import React from 'react';
import styles from './Header.module.css';
import Link from 'next/link';

export const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <Link href="/">
                <h1 className={styles.title}>Question App</h1>
            </Link>
        </header>
    );
};
