'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { CATEGORIES } from '@/data/categories';
import styles from './page.module.css';

export default function SubmitPage() {
    const router = useRouter();
    const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
    const [text, setText] = useState('');
    const [depth, setDepth] = useState('normal');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId, text, depth }),
            });

            if (res.ok) {
                setSuccess(true);
                setText('');
                setTimeout(() => setSuccess(false), 3000);
            } else {
                alert('送信に失敗しました');
            }
        } catch (error) {
            alert('エラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <Container>
                <div className={styles.wrapper}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>新しい質問を投稿</h2>

                    {success && (
                        <div className={styles.success}>
                            質問を受け付けました！ありがとうございます。
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.wrapper}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>カテゴリ</label>
                            <select
                                className={styles.select}
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>質問文</label>
                            <textarea
                                className={styles.textarea}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="例：もし100万円もらったら何に使う？"
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>深さ</label>
                            <select
                                className={styles.select}
                                value={depth}
                                onChange={(e) => setDepth(e.target.value)}
                            >
                                <option value="light">Light (気軽)</option>
                                <option value="normal">Normal (通常)</option>
                                <option value="deep">Deep (深い)</option>
                            </select>
                        </div>

                        <div className={styles.note}>
                            <p>※ 投稿された質問は管理者の承認後に公開されます。</p>
                        </div>

                        <Button type="submit" disabled={isSubmitting || !text} fullWidth>
                            {isSubmitting ? '送信中...' : '質問を投稿する'}
                        </Button>

                        <Button type="button" variant="ghost" onClick={() => router.back()} fullWidth>
                            戻る
                        </Button>
                    </form>
                </div>
            </Container>
        </>
    );
}
