import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const ctx = getRequestContext();
        const db = ctx?.env?.DB;

        if (!db) {
            return new Response(JSON.stringify({ error: "DB not found in hello API" }), { status: 500 });
        }

        // api/questions と同じクエリを実行
        const { results } = await db.prepare('SELECT * FROM questions ORDER BY created_at DESC').all();

        return new Response(JSON.stringify({
            message: "Hello - Data Fetch Test",
            count: results?.length || 0,
            results: results // 生のデータをそのまま返す
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return new Response(JSON.stringify({
            error: "Data Fetch failed in hello API",
            details: msg
        }), { status: 500 });
    }
}
