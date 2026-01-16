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
        const ctx = getRequestContext();
        const db = ctx?.env?.DB;
        if (!db) {
            return new Response(JSON.stringify({ error: 'Database binding "DB" not found' }), { status: 500 });
        }

        let body: any;
        try {
            body = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
        }

        const { categoryId, text, depth, clientId } = body;
        const ip = request.headers.get('cf-connecting-ip') || 'unknown';

        // Validation: 必須チェック
        if (!categoryId || !text) {
            return new Response(JSON.stringify({ error: '必須項目が不足しています' }), { status: 400 });
        }

        // Validation: 文字数制限 (5〜100文字)
        const trimmedText = text.trim();
        if (trimmedText.length < 5) {
            return new Response(JSON.stringify({ error: '5文字以上入力してください' }), { status: 400 });
        }
        if (trimmedText.length > 100) {
            return new Response(JSON.stringify({ error: '入力内容が長すぎます（100文字以内）' }), { status: 400 });
        }

        // Rate Limit Check (10 minutes)
        const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
        const recentPost = await db.prepare(
            'SELECT 1 FROM questions WHERE (author_id = ? OR ip_address = ?) AND created_at > ? LIMIT 1'
        ).bind(clientId || 'guest', ip, tenMinutesAgo).first();

        if (recentPost) {
            return new Response(JSON.stringify({
                error: '投稿間隔が短すぎます。しばらく時間を置いて（約10分）再度お試しください。'
            }), { status: 429 });
        }

        const id = `q_${Date.now()}`;
        const now = Date.now();

        await db.prepare(
            `INSERT INTO questions (id, category_id, text, depth, rating, status, author_id, ip_address, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            id,
            categoryId,
            trimmedText,
            depth || 'normal',
            'general',
            'pending',
            clientId || 'guest',
            ip,
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
