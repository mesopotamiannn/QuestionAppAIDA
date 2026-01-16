import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const ctx = getRequestContext();
        const db = ctx?.env?.DB;

        let dbStatus = "Not Attempted";
        let dbError = null;

        if (db) {
            try {
                const res = await db.prepare('SELECT 1').first();
                dbStatus = res ? "Connected (SELECT 1 Success)" : "Empty Result";

                // テーブルの存在チェック
                try {
                    await db.prepare('SELECT 1 FROM questions LIMIT 1').run();
                    dbStatus += " / Table 'questions' exists";
                } catch (te) {
                    dbStatus += " / Table 'questions' MISSING";
                    dbError = te instanceof Error ? te.message : String(te);
                }
            } catch (e) {
                dbStatus = "Connection Failed";
                dbError = e instanceof Error ? e.message : String(e);
            }
        }

        return new Response(JSON.stringify({
            message: "Hello from Edge Runtime!",
            hasCtx: !!ctx,
            envKeys: ctx?.env ? Object.keys(ctx.env) : [],
            dbStatus,
            dbError
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return new Response(JSON.stringify({
            error: "Generic failure in hello API",
            details: msg
        }), { status: 500 });
    }
}
