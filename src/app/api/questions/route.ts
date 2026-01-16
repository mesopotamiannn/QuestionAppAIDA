import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

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

        return new Response(JSON.stringify(results || []), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return new Response(JSON.stringify({ error: "API Error", details: msg }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
