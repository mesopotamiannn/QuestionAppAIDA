import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = (await request.json()) as { clientId: string };
        const { clientId } = body;

        if (!clientId) {
            return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
        }

        const { env } = getRequestContext();
        const db = env.DB;

        // Check if already liked (using composite primary key constraint will throw if duplicate, 
        // but we can check existence first for cleaner response)
        const existing = await db.prepare(
            'SELECT 1 FROM question_likes WHERE question_id = ? AND client_id = ?'
        ).bind(id, clientId).first();

        if (existing) {
            return NextResponse.json({ success: true, alreadyLiked: true });
        }

        // Insert like
        await db.prepare(
            'INSERT INTO question_likes (question_id, client_id, created_at) VALUES (?, ?, ?)'
        ).bind(id, clientId, Date.now()).run();

        // Get new count
        const countResult = await db.prepare(
            'SELECT COUNT(*) as count FROM question_likes WHERE question_id = ?'
        ).bind(id).first<{ count: number }>();

        return NextResponse.json({ success: true, likeCount: countResult?.count || 0 });

    } catch (error) {
        console.error('Like API Error:', error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: 'Internal Server Error', details: msg }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { env } = getRequestContext();
        const db = env.DB;

        const countResult = await db.prepare(
            'SELECT COUNT(*) as count FROM question_likes WHERE question_id = ?'
        ).bind(id).first<{ count: number }>();

        return NextResponse.json({ likeCount: countResult?.count || 0 });
    } catch (error) {
        console.error('Like GET Error:', error);
        return NextResponse.json({ likeCount: 0 });
    }
}
