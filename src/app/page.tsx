'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { Modal } from '@/components/ui/Modal';
import { useGameSession } from '@/hooks/useGameSession';
import { CATEGORIES, ADULT_CATEGORY } from '@/data/categories';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const { startSession, loading } = useGameSession();
  const [names, setNames] = useState<string[]>(['', '']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [count, setCount] = useState<number>(10);
  const [is18Plus, setIs18Plus] = useState(false);
  const [showAgeCheck, setShowAgeCheck] = useState(false);

  // テーマ切替
  useEffect(() => {
    if (is18Plus) {
      document.documentElement.setAttribute('data-theme', 'adult');
    } else {
      document.documentElement.removeAttribute('data-theme');
      // 18+ OFF時はAdultカテゴリの選択を解除
      setSelectedCategories(prev => prev.filter(id => id !== ADULT_CATEGORY.id));
    }
  }, [is18Plus]);

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

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const selectAllCategories = () => {
    const allIds = CATEGORIES.map(c => c.id);
    if (is18Plus) allIds.push(ADULT_CATEGORY.id);
    setSelectedCategories(allIds);
  };

  const clearCategories = () => {
    setSelectedCategories([]);
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
      selectedCategories, // 複数カテゴリ対応
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 className={styles.label}>カテゴリ</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="ghost" size="small" onClick={selectAllCategories}>すべて</Button>
                <Button variant="ghost" size="small" onClick={clearCategories}>クリア</Button>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.75rem' }}>
              ※ 未選択の場合は全カテゴリから出題
            </p>
            <div className={styles.chipGrid}>
              {CATEGORIES.map(c => (
                <CategoryChip
                  key={c.id}
                  label={c.name}
                  selected={selectedCategories.includes(c.id)}
                  onClick={() => toggleCategory(c.id)}
                />
              ))}
              {is18Plus && (
                <CategoryChip
                  label={ADULT_CATEGORY.name}
                  selected={selectedCategories.includes(ADULT_CATEGORY.id)}
                  isAdult
                  onClick={() => toggleCategory(ADULT_CATEGORY.id)}
                />
              )}
            </div>
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
          <Button variant="primary" onClick={confirmAge} fullWidth>はい</Button>
        </div>
      </Modal>
    </>
  );
}
