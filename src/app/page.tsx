'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { useGameSession } from '@/hooks/useGameSession';
import { CATEGORIES } from '@/data/categories';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const { startSession, loading } = useGameSession();
  const [names, setNames] = useState<string[]>(['', '']);
  const [categoryId, setCategoryId] = useState<string>('all'); // 'all' or specific ID
  const [count, setCount] = useState<number>(10);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const addName = () => {
    if (names.length < 12) setNames([...names, '']);
  };

  const removeName = (index: number) => {
    if (names.length > 2) {
      const newNames = names.filter((_, i) => i !== index);
      setNames(newNames);
    }
  };

  const handleStart = async () => {
    // Basic validation
    const validNames = names.filter(n => n.trim() !== '');
    if (validNames.length < 2) {
      alert('参加者を2人以上入力してください');
      return;
    }

    const session = await startSession(
      validNames,
      categoryId,
      count, // Fixed count for MVP
      'interactive',
      false // 18+ OFF
    );

    if (session) {
      router.push('/game');
    }
  };

  return (
    <>
      <Header />
      <Container>
        <div className={styles.wrapper}>
          <section className={styles.section}>
            <h2 className={styles.label}>参加者</h2>
            <div className={styles.nameList}>
              {names.map((name, i) => (
                <div key={i} className={styles.nameRow}>
                  <Input
                    placeholder={`参加者 ${i + 1}`}
                    value={name}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                  />
                  {names.length > 2 && (
                    <button onClick={() => removeName(i)} className={styles.removeBtn}>×</button>
                  )}
                </div>
              ))}
              {names.length < 12 && (
                <Button variant="ghost" onClick={addName}>+ 追加する</Button>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.label}>カテゴリ</h2>
            <select
              className={styles.select}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="all">ランダム (全カテゴリ)</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </section>

          <section className={styles.section}>
            <h2 className={styles.label}>質問数</h2>
            <div className={styles.countOptions}>
              {[10, 20, 30].map(c => (
                <Button
                  key={c}
                  variant={count === c ? 'primary' : 'secondary'}
                  onClick={() => setCount(c)}
                  style={{ flex: 1 }}
                >
                  {c}問
                </Button>
              ))}
            </div>
          </section>

          <div className={styles.action}>
            <Button fullWidth onClick={handleStart} disabled={loading}>
              {loading ? '準備中...' : 'スタート！'}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
