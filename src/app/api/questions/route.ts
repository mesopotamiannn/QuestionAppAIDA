import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { Question } from '@/types';

export const runtime = 'edge';

// GET: List questions (e.g. for admin or sync)
export async function GET() {
    try {
        const ctx = getRequestContext();
        if (!ctx) {
            return new Response(JSON.stringify({ error: 'RequestContext is null', step: 'getRequestContext' }), { status: 500 });
        }

        const env = ctx.env;
        if (!env) {
            return new Response(JSON.stringify({ error: 'env is null', step: 'getEnv' }), { status: 500 });
        }

        const db = env.DB;
        if (!db) {
            return new Response(JSON.stringify({
                error: 'DB binding not found',
                step: 'getDB',
                details: 'Please ensure D1 binding "DB" is set in Cloudflare dashboard.'
            }), { status: 500 });
        }

        const { results } = await db.prepare('SELECT * FROM questions ORDER BY created_at DESC').all<Question>();
        return NextResponse.json(results);
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return new Response(JSON.stringify({ error: 'Exception occurred', details: msg }), { status: 500 });
    }
}

interface SubmitBody {
    categoryId: string;
    text: string;
    depth?: Question['depth'];
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as SubmitBody;
        const { categoryId, text, depth } = body;

        // Validation
        if (!categoryId || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ctx = getRequestContext();
        if (!ctx) {
            return new Response(JSON.stringify({ error: 'RequestContext is null', step: 'getRequestContext' }), { status: 500 });
        }

        const env = ctx.env;
        if (!env) {
            return new Response(JSON.stringify({ error: 'env is null', step: 'getEnv' }), { status: 500 });
        }

        const db = env.DB;
        if (!db) {
            return new Response(JSON.stringify({
                error: 'DB binding not found',
                step: 'getDB',
                details: 'Please ensure D1 binding "DB" is set in Cloudflare dashboard.'
            }), { status: 500 });
        }

        const id = `q_${Date.now()}`;
        const now = Date.now();

        // Insert into D1
        await db.prepare(
            `INSERT INTO questions (id, category_id, text, depth, rating, status, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            id,
            categoryId,
            text,
            depth || 'normal',
            'general',
            'pending',
            now,
            now
        ).run();

        const newQuestion: Question = {
            id,
            categoryId,
            text,
            depth: depth || 'normal',
            rating: 'general',
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        };

        return NextResponse.json(newQuestion);
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: 'Exception occurred', details: msg }), { status: 500 });
    }
}
