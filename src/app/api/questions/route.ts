import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { Question } from '@/types';

export const runtime = 'edge';

// GET: List questions (e.g. for admin or sync)
export async function GET() {
    try {
        const { env } = getRequestContext();
        const db = env.DB;
        const { results } = await db.prepare('SELECT * FROM questions ORDER BY created_at DESC').all<Question>();
        return NextResponse.json(results);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
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

        const { env } = getRequestContext();
        const db = env.DB;
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
        console.error('Submit API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
