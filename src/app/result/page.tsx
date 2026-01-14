'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';

export default function ResultPage() {
    const router = useRouter();

    return (
        <>
            <Header />
            <Container>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: '2rem',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--primary)' }}>終了！</h2>
                    <p>すべての質問が終わりました。<br />楽しんでもらえましたか？</p>

                    <Button onClick={() => router.push('/')}>
                        ホームに戻る
                    </Button>
                </div>
            </Container>
        </>
    );
}
