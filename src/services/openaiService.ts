import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export async function sendChatMessage(
  message: string,
  deal: any,
  previousMessages: any[]
) {
  try {
    const systemPrompt = `You are an expert financial modeling assistant specialized in M&A, PE, and LBO transactions. You are helping with a ${deal.dealType} deal for ${deal.company} (Project ${deal.name}) with a deal size of $${deal.dealSize}M.

Your capabilities include:
- Explaining financial modeling concepts and calculations
- Suggesting optimizations for deal structures
- Modifying model assumptions and explaining their impact
- Providing industry benchmarks and best practices
- Generating Excel formulas for complex calculations

Be concise, professional, and provide actionable insights. When suggesting formula changes, provide the exact Excel formula syntax.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...previousMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback response for demo purposes
    return generateFallbackResponse(message, deal);
  }
}

function generateFallbackResponse(message: string, deal: any): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('irr') || lowerMessage.includes('return')) {
    return `For this ${deal.dealType} transaction, targeting ${deal.targetIRR} IRR is aggressive but achievable. Key drivers include:

1. Revenue growth assumptions (currently 10% annually)
2. EBITDA margin expansion opportunities
3. Leverage optimization (60/40 debt/equity split)
4. Exit multiple assumptions (12x EBITDA)

To improve returns, consider:
- Accelerating revenue growth through add-on acquisitions
- Implementing operational improvements to expand margins
- Optimizing the capital structure with cheaper debt`;
  }

  if (lowerMessage.includes('debt') || lowerMessage.includes('leverage')) {
    return `The current debt structure assumes:
- Debt: $${(parseFloat(deal.dealSize) * 0.6).toFixed(0)}M (60% of deal value)
- Interest rate: 8%
- 7-year term with straight-line amortization

This 3.0x leverage ratio is conservative for an LBO. You might consider:
- Increasing leverage to 4-5x EBITDA for higher returns
- Structuring with senior/subordinated tranches
- Adding a revolving credit facility for flexibility`;
  }

  if (lowerMessage.includes('excel') || lowerMessage.includes('formula')) {
    return `Here are key Excel formulas for your model:

**IRR Calculation:**
\`=XIRR(cash_flows, dates)\`

**Debt Schedule:**
\`=IF(year<=term, beginning_balance/term, 0)\`

**EBITDA Growth:**
\`=prior_year_EBITDA*(1+growth_rate)\`

**Exit Value:**
\`=exit_year_EBITDA*exit_multiple\`

Would you like me to explain any specific calculation?`;
  }

  return `I understand you're asking about "${message}" for this ${deal.dealType} deal. 

Key aspects to consider:
- Current assumptions show a ${deal.targetIRR} target IRR
- Deal size of $${deal.dealSize}M
- 5-year investment horizon

How can I help you optimize this specific aspect of the model?`;
}