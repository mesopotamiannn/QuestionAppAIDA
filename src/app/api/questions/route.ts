import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// ヘルパー：スネークケースのオブジェクトをキャメルケースに変換
function toCamelCase(obj: any) {
    if (!obj) return obj;
    const newObj: any = {};
    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newObj[camelKey] = obj[key];
    }
    return newObj;
}

// GET: List questions
export async function GET() {
    try {
        const ctx = getRequestContext();
        const db = ctx?.env?.DB;

        if (!db) {
            return new Response(JSON.stringify({ error: "DB binding not found" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { results } = await db.prepare('SELECT * FROM questions ORDER BY created_at DESC').all();
        const camelResults = (results || []).map(toCamelCase);

        return new Response(JSON.stringify(camelResults), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return new Response(JSON.stringify({ error: "GET API Error", details: msg }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// POST: Submit question
export async function POST(request: Request) {
    try {
        let body: any;
        try {
            body = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
        }

        const { categoryId, text, depth } = body;

        // Validation: 必須チェック
        if (!categoryId || !text) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Validation: 文字数制限 (5〜100文字)
        const trimmedText = text.trim();
        if (trimmedText.length < 5) {
            return new Response(JSON.stringify({ error: 'Question is too short (min 5 characters)' }), { status: 400 });
        }
        if (trimmedText.length > 100) {
            return new Response(JSON.stringify({ error: 'Question is too long (max 100 characters)' }), { status: 400 });
        }

        const ctx = getRequestContext();
        const db = ctx?.env?.DB;
        if (!db) {
            return new Response(JSON.stringify({ error: 'Database binding "DB" not found' }), { status: 500 });
        }

        const id = `q_${Date.now()}`;
        const now = Date.now();

        await db.prepare(
            `INSERT INTO questions (id, category_id, text, depth, rating, status, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            id,
            categoryId,
            trimmedText,
            depth || 'normal',
            'general',
            'pending',
            now,
            now
        ).run();

        const newQuestion = {
            id,
            categoryId,
            text: trimmedText,
            depth: depth || 'normal',
            rating: 'general',
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        };

        return new Response(JSON.stringify(newQuestion), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return new Response(JSON.stringify({ error: 'POST API Error', details: msg }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
