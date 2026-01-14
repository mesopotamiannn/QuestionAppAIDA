import { NextResponse } from 'next/server';
import { INITIAL_QUESTIONS } from '@/data/initialQuestions';
import { Question } from '@/types';

// Mock in-memory DB for now (since we use Client-side DB for reading)
// In robust implementation, this would connect to Cloudflare D1 via binding
const questions: Question[] = [...INITIAL_QUESTIONS];

export async function GET() {
    return NextResponse.json(questions);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { categoryId, text, depth } = body;

        // Validation
        if (!categoryId || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newQuestion: Question = {
            id: `q_${Date.now()}`,
            categoryId,
            text,
            depth: depth || 'normal',
            rating: 'general',
            status: 'pending', // Pending approval
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        // In a real app, save to D1 here
        // questions.push(newQuestion); // In-memory update

        return NextResponse.json(newQuestion);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
