import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        let body: any;
        try {
            body = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
        }
        const { clientId } = body;

        if (!clientId) {
            return new Response(JSON.stringify({ error: 'clientId is required' }), { status: 400 });
        }

        const ctx = getRequestContext();
        const db = ctx?.env?.DB;
        if (!db) {
            return new Response(JSON.stringify({ error: 'Database binding "DB" not found' }), { status: 500 });
        }

        const existing = await db.prepare(
            'SELECT 1 FROM question_likes WHERE question_id = ? AND client_id = ?'
        ).bind(id, clientId).first();

        if (existing) {
            return new Response(JSON.stringify({ success: true, alreadyLiked: true }), { status: 200 });
        }

        await db.prepare(
            'INSERT INTO question_likes (question_id, client_id, created_at) VALUES (?, ?, ?)'
        ).bind(id, clientId, Date.now()).run();

        const countResult = await db.prepare(
            'SELECT COUNT(*) as count FROM question_likes WHERE question_id = ?'
        ).bind(id).first<{ count: number }>();

        return new Response(JSON.stringify({ success: true, likeCount: countResult?.count || 0 }), { status: 200 });

    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: 'Like POST Error', details: msg }), { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const ctx = getRequestContext();
        const db = ctx?.env?.DB;
        if (!db) {
            return new Response(JSON.stringify({ error: 'Database binding "DB" not found' }), { status: 500 });
        }

        const countResult = await db.prepare(
            'SELECT COUNT(*) as count FROM question_likes WHERE question_id = ?'
        ).bind(id).first<{ count: number }>();

        return new Response(JSON.stringify({ likeCount: countResult?.count || 0 }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ likeCount: 0 }), { status: 200 });
    }
}
