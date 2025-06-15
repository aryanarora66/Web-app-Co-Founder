// src/app/api/ai-ideas/detailed/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get the token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse request body
    const { idea, industry, keywords } = await request.json();

    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }

    // Create a comprehensive prompt for detailed analysis
    const prompt = `As a senior business consultant and startup advisor, provide a comprehensive analysis of this startup idea: "${idea}"

${industry ? `Industry Context: ${industry}` : ''}
${keywords ? `Related Keywords/Focus Areas: ${keywords}` : ''}

Please provide a detailed business analysis in the following structure:

**EXECUTIVE SUMMARY**
Provide a concise overview of the opportunity and key recommendations.

**1. MARKET ANALYSIS**
- Target Market: Define the primary and secondary target markets
- Market Size: Estimate the Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM)
- Market Trends: Identify relevant industry trends and growth drivers
- Customer Segments: Detail specific customer personas and their pain points
- Competitive Landscape: Analyze direct and indirect competitors

**2. BUSINESS MODEL & VALUE PROPOSITION**
- Value Proposition: Clearly articulate the unique value delivered
- Revenue Streams: Identify potential monetization strategies
- Pricing Strategy: Suggest pricing models and strategies
- Cost Structure: Outline major cost categories and considerations
- Unit Economics: Estimate key metrics like Customer Acquisition Cost (CAC) and Lifetime Value (LTV)

**3. IMPLEMENTATION ROADMAP**
- Phase 1 (Months 1-6): Initial development and validation steps
- Phase 2 (Months 7-18): Market entry and early growth
- Phase 3 (Months 19+): Scaling and expansion
- Key Milestones: Critical achievements for each phase
- Resource Requirements: Team, technology, and infrastructure needs

**4. FINANCIAL PROJECTIONS**
- Startup Costs: Initial investment requirements
- Revenue Projections: 3-year revenue forecast with assumptions
- Break-even Analysis: Time to profitability
- Funding Requirements: Capital needs and potential funding sources
- Key Financial Metrics: Important KPIs to track

**5. RISK ANALYSIS & MITIGATION**
- Market Risks: Demand, competition, and market timing risks
- Operational Risks: Execution, team, and technical risks
- Financial Risks: Funding, cash flow, and economic risks
- Mitigation Strategies: Specific actions to address each risk category

**6. SUCCESS FACTORS & RECOMMENDATIONS**
- Critical Success Factors: What must go right for this venture to succeed
- Strategic Recommendations: Key advice for entrepreneurs pursuing this idea
- Next Steps: Immediate actions to validate and pursue this opportunity

Please be specific, actionable, and include realistic estimates where possible. Focus on practical insights that would help an entrepreneur make informed decisions about pursuing this opportunity.`;

    // Make the AI API call (using OpenAI as example - adjust for your AI service)
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4', // or gpt-3.5-turbo for lower costs
        messages: [
          {
            role: 'system',
            content: 'You are a senior business consultant and startup advisor with extensive experience in market analysis, business strategy, and venture capital. Provide detailed, actionable business analysis with specific recommendations and realistic projections.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API Error:', await aiResponse.text());
      throw new Error('Failed to generate analysis from AI service');
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0]?.message?.content || 'Analysis could not be generated.';

    // Optionally, you could save the analysis to your database here
    // await AnalysisModel.create({
    //   userId: decoded.id,
    //   ideaTitle: idea,
    //   industry,
    //   keywords,
    //   analysis,
    //   createdAt: new Date()
    // });

    return NextResponse.json({ 
      analysis,
      metadata: {
        ideaTitle: idea,
        industry,
        keywords,
        generatedAt: new Date().toISOString(),
        userId: decoded.id
      }
    });

  } catch (error) {
    console.error('Error generating detailed analysis:', error);
    
    // Handle JWT verification errors specifically
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to generate detailed analysis' },
      { status: 500 }
    );
  }
}
