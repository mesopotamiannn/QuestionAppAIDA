import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const ctx = getRequestContext();
        return new Response(JSON.stringify({
            message: "Hello from Edge Runtime!",
            hasCtx: !!ctx,
            envKeys: ctx?.env ? Object.keys(ctx.env) : []
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return new Response(JSON.stringify({
            error: "getRequestContext failed",
            details: msg
        }), { status: 500 });
    }
}
