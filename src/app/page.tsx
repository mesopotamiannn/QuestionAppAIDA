'use client';

import { useEffect, useState } from 'react';
import { getAllQuestions } from '@/utils/db';

export default function Home() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getAllQuestions().then(questions => {
      setCount(questions.length);
    });
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '2rem'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
        Question App
      </h1>
      <p>Setup Complete.</p>
      {count !== null && (
        <p style={{ color: 'var(--accent)' }}>
          DB Initialized. Questions loaded: {count}
        </p>
      )}
    </div>
  );
}
