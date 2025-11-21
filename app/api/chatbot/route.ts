import { NextRequest, NextResponse } from 'next/server';

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type HistoryEntry = {
  role: 'user' | 'bot';
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    const { message, context, history = [], apiKey } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 400 });
    }

    const prompt = `Context:\n${context || 'No data provided.'}\n\nUser question:\n${message}`;

    const contents = [
      ...history
        .slice(-8)
        .map((entry: HistoryEntry) => ({
          role: entry.role === 'bot' ? 'model' : 'user',
          parts: [{ text: entry.content }],
        })),
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Gemini API error:', error);
      return NextResponse.json(
        { error: 'Gemini request failed', details: error },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('\n') ??
      'I could not generate a response.';

    return NextResponse.json({ message: text.trim() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

