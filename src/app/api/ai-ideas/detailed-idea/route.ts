// app/api/startup-ideas-generator/detailed-idea/route.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { idea, industry, keywords } = await request.json();

    const prompt = `Generate a detailed business analysis for this startup idea:
    
    Idea: ${idea}
    Industry: ${industry}
    Keywords: ${keywords}

    Provide the following sections with detailed information:
    
    1. **Business Overview**: Detailed description of the idea
    2. **Target Market**: Detailed analysis of target customers
    3. **SWOT Analysis**: Strengths, Weaknesses, Opportunities, Threats
    4. **Business Model**: Revenue streams and monetization strategy
    5. **Competitive Advantage**: What makes this unique
    6. **Initial Steps**: How to get started
    7. **Potential Challenges**: Possible obstacles and solutions
    
    Format the response with clear section headings in Markdown.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1500,
    });

    const details = completion.choices[0]?.message?.content || 'No details generated.';

    return new Response(JSON.stringify({ details }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating details:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate details' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}