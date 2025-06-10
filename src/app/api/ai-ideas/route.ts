// src/app/api/ai-ideas/route.ts (move your existing file here)

import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { industry, keywords, mood } = await request.json();

    const prompt = `Generate 5 unique startup ideas based on the following criteria:
    - Industry: ${industry}
    - Keywords: ${keywords}
    - Mood: ${mood}
    
    For each idea, provide:
    1. A catchy name (bold this with ** on each side)
    2. A one-sentence description
    3. The target audience (prefix with "Audience: ")
    4. Potential revenue streams (prefix with "Revenue: ")
    
    Separate each idea with a blank line and format the response as a numbered list.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      max_tokens: 1000,
    });

    const ideas = completion.choices[0]?.message?.content || 'No ideas generated.';

    return new Response(JSON.stringify({ ideas }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating ideas:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate ideas. Please try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}