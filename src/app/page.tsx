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
import { AnswerMode } from '@/types'; // AnswerMode type
import { syncQuestions } from '@/utils/db'; // Sync logic
import HowToPlayModal from '@/components/HowToPlayModal';

export default function Home() {
  const router = useRouter();
  const { startSession, loading } = useGameSession();
  const [names, setNames] = useState<string[]>(['', '']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [count, setCount] = useState<number>(10);
  const [is18Plus, setIs18Plus] = useState(false);
  const [showAgeCheck, setShowAgeCheck] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [answerMode, setAnswerMode] = useState<AnswerMode>('everyone'); // Default to everyone

  // Load persistence and sync
  useEffect(() => {
    // 1. D1 Sync
    syncQuestions();

    // 2. Load names with expiration (2 hours)
    const PERSISTENCE_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours
    const saved = localStorage.getItem('lastParticipantsData');

    if (saved) {
      try {
        const { names: savedNames, updatedAt } = JSON.parse(saved);
        const age = Date.now() - updatedAt;

        if (age < PERSISTENCE_EXPIRY) {
          if (Array.isArray(savedNames) && savedNames.length >= 2) {
            setNames(savedNames);
          }
        } else {
          localStorage.removeItem('lastParticipantsData');
        }
      } catch (e) {
        console.error('Failed to parse saved names', e);
      }
    }
  }, []);

  // Theme switch
  useEffect(() => {
    if (is18Plus) {
      document.documentElement.setAttribute('data-theme', 'adult');
    } else {
      document.documentElement.removeAttribute('data-theme');
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

  const clearNames = () => {
    setNames(['', '']);
    localStorage.removeItem('lastParticipantsData');
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
    if (names.length < 2) {
      alert('参加者を2人以上設定してください');
      return;
    }

    // Save names logic with timestamp
    localStorage.setItem('lastParticipantsData', JSON.stringify({
      names,
      updatedAt: Date.now()
    }));

    // Force 'everyone' if participants > 2 (though UI hides option)
    const finalMode = names.length > 2 ? 'everyone' : answerMode;

    const session = await startSession(
      names,
      selectedCategories,
      count,
      finalMode,
      is18Plus
    );

    if (session) {
      router.push('/game');
    }
  };

  return (
    <>
      <Header />
      <div style={{ position: 'fixed', top: '12px', right: '12px', zIndex: 100 }}>
        <Button variant="secondary" size="small" onClick={() => setShowHowToPlay(true)} style={{ borderRadius: '20px', padding: '6px 16px', fontSize: '0.8rem', opacity: 0.9 }}>
          💡 遊び方
        </Button>
      </div>
      <Container>
        <div className={styles.wrapper}>
          <section className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 className={styles.label}>参加者</h2>
              <Button variant="ghost" size="small" onClick={clearNames}>クリア</Button>
            </div>
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

          {names.length === 2 && (
            <section className={styles.section}>
              <h2 className={styles.label}>回答順モード</h2>
              <div className={styles.countOptions}>
                <Button
                  variant={answerMode === 'everyone' ? 'primary' : 'secondary'}
                  onClick={() => setAnswerMode('everyone')}
                  style={{ flex: 1 }}
                  size="small"
                >
                  全員回答
                </Button>
                <Button
                  variant={answerMode === 'interactive' ? 'primary' : 'secondary'}
                  onClick={() => setAnswerMode('interactive')}
                  style={{ flex: 1 }}
                  size="small"
                >
                  交互に回答
                </Button>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                {answerMode === 'everyone' ? '1つの質問に全員が答えてから次へ進みます' : '1問ごとに回答者が交代します'}
              </p>
            </section>
          )}

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

          <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/submit" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'underline' }}>
              新しい質問を投稿する
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

      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
    </>
  );
}
