import { NextResponse } from 'next/server';

// In-memory storage for likes (D1の代わり。本番はD1へ移行)
const likes: Map<string, Set<string>> = new Map();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { clientId } = body;

        if (!clientId) {
            return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
        }

        // いいね登録（重複チェック）
        if (!likes.has(id)) {
            likes.set(id, new Set());
        }

        const questionLikes = likes.get(id)!;
        if (questionLikes.has(clientId)) {
            // 既にいいね済み
            return NextResponse.json({ success: true, alreadyLiked: true });
        }

        questionLikes.add(clientId);

        return NextResponse.json({ success: true, likeCount: questionLikes.size });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const questionLikes = likes.get(id);
    return NextResponse.json({ likeCount: questionLikes?.size || 0 });
}
