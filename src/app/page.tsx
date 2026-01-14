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

import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { startSession, loading } = useGameSession();
  const [names, setNames] = useState<string[]>(['', '']);
  const [categoryId, setCategoryId] = useState<string>('all');
  const [count, setCount] = useState<number>(10);
  const [is18Plus, setIs18Plus] = useState(false);
  const [showAgeCheck, setShowAgeCheck] = useState(false);

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

  const handle18PlusToggle = () => {
    if (!is18Plus) {
      setShowAgeCheck(true);
    } else {
      setIs18Plus(false);
    }
  };

  const confirmAge = () => {
    setIs18Plus(true);
    setShowAgeCheck(false);
  };

  const handleStart = async () => {
    const validNames = names.filter(n => n.trim() !== '');
    if (validNames.length < 2) {
      alert('参加者を2人以上入力してください');
      return;
    }

    const session = await startSession(
      validNames,
      categoryId,
      count,
      'interactive',
      is18Plus
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

          <section className={styles.section}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className={styles.label}>18+ モード</h2>
              <Button
                variant={is18Plus ? 'primary' : 'secondary'}
                size="small"
                onClick={handle18PlusToggle}
              >
                {is18Plus ? 'ON' : 'OFF'}
              </Button>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>※ 刺激的な質問が含まれます</p>
          </section>

          <div className={styles.action}>
            <Button fullWidth onClick={handleStart} disabled={loading}>
              {loading ? '準備中...' : 'スタート！'}
            </Button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link href="/submit" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'underline' }}>
              質問を投稿する
            </Link>
          </div>
        </div>
      </Container>

      <Modal isOpen={showAgeCheck} onClose={() => setShowAgeCheck(false)}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>年齢確認</h3>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
          このモードには、成人向け（18歳以上）のトピックや刺激的な質問が含まれます。<br />
          利用者は18歳以上ですか？また、他の参加者も同様ですか？
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => setShowAgeCheck(false)} fullWidth>いいえ</Button>
          <Button variant="primary" onClick={confirmAge} fullWidth>はい (有効化)</Button>
        </div>
      </Modal>
    </>
  );
}
