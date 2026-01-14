import React from 'react';

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: 'var(--spacing-lg)',
            width: '100%',
            minHeight: 'calc(100vh - 60px)', // minus header
        }}>
            {children}
        </div>
    );
};
