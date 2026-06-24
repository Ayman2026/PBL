# AI Integration Guide

This document outlines how to integrate LLM-based narrative generation into the grant reporting system.

## Current Architecture

The application currently uses **rule-based narrative generation** with full fact traceability:

```typescript
// Current: Rule-based generation
const report = generateGrantNarrative(facts, useAiStyle = true);
// Returns: { narrative, sourceFacts, deterministicSummary }
```

All narratives are generated from structured `sourceFacts` arrays that contain only verified data from CSVs.

## Integration Points

### 1. API Route for LLM Calls

Create `/app/api/generate-narrative/route.ts`:

```typescript
import { OpenAI } from "openai";
import type { GrantReportFacts, SourceFact } from "@/lib/types";

export async function POST(request: Request) {
  const { facts }: { facts: GrantReportFacts } = await request.json();
  
  const sourceFacts = buildSourceFacts(facts);
  const prompt = buildPrompt(sourceFacts);
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a grant report writer. Generate narrative text using ONLY the facts provided. Cite facts by their label in square brackets [label]."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3, // Low temperature for consistency
  });
  
  return Response.json({
    narrative: response.choices[0].message.content,
    sourceFacts,
  });
}

function buildPrompt(facts: SourceFact[]): string {
  return `
Generate a grant report narrative using ONLY these verified facts:

${facts.map(f => `[${f.label}]: ${f.value}`).join('\n')}

Requirements:
- Use professional, concise language
- Include all key metrics
- Highlight risks and gaps
- Cite each fact used by its label
- Do not invent or extrapolate data
  `.trim();
}
```

### 2. Client-Side Integration

Update `GrantReportAssistant.tsx` to call the API:

```typescript
const [isGenerating, setIsGenerating] = useState(false);

async function generateWithAI() {
  setIsGenerating(true);
  try {
    const response = await fetch('/api/generate-narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facts }),
    });
    const data = await response.json();
    setReport(data);
  } finally {
    setIsGenerating(false);
  }
}
```

### 3. Validation Layer

Add fact validation to ensure LLM output only uses provided facts:

```typescript
function validateNarrative(
  narrative: string,
  allowedFacts: SourceFact[]
): { valid: boolean; violations: string[] } {
  // Extract citations from narrative
  const citations = narrative.match(/\[([^\]]+)\]/g) || [];
  const violations: string[] = [];
  
  for (const cite of citations) {
    const label = cite.slice(1, -1);
    if (!allowedFacts.some(f => f.label === label)) {
      violations.push(`Cited unknown fact: ${label}`);
    }
  }
  
  return { valid: violations.length === 0, violations };
}
```

## Prompt Engineering Best Practices

### System Prompt Template

```
You are a grant report writer for an education NGO.

Your task is to convert structured program data into narrative reports for donors.

Rules:
1. Use ONLY the facts provided in the user message
2. Cite each fact used by its label [like this]
3. Do not extrapolate, infer, or add information not explicitly stated
4. Maintain professional, concise language
5. Highlight metrics, achievements, risks, and recommendations
6. Structure: Overview → Performance → Finance → Evidence → Risks → Recommendations

Output format: Plain text with fact citations in square brackets.
```

### Few-Shot Examples

Include 2-3 examples of input facts → expected narrative in the system prompt:

```
Example Input:
[PBL completion rate]: 77.9%
[Schools completed PBL]: 515 / 661
[Risk status]: At Risk

Example Output:
During the reporting period, PBL completion reached 77.9% [PBL completion rate] across 515 of 661 sampled schools [Schools completed PBL]. The program is classified as At Risk [Risk status], requiring targeted follow-up.
```

## Cost Management

### Estimate Token Usage

- Average source facts: ~500 tokens
- System prompt: ~200 tokens
- Expected output: ~300-500 tokens
- **Total per generation: ~1,000 tokens**

At GPT-4 pricing (~$0.03/1K tokens):
- Cost per report: $0.03
- 1,000 reports/month: $30

### Caching Strategy

Cache generated narratives keyed by grant + month:

```typescript
const cacheKey = `narrative:${grantId}:${reportingMonth}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// ... generate new narrative ...

await redis.setex(cacheKey, 3600, JSON.stringify(result)); // 1 hour TTL
```

## Alternative: Open Source Models

### Local Deployment with Llama

```typescript
import { Ollama } from "ollama";

const ollama = new Ollama({ host: process.env.OLLAMA_HOST });

const response = await ollama.chat({
  model: "llama3:8b",
  messages: [{ role: "user", content: prompt }],
});
```

**Pros:** No per-call cost, full data control
**Cons:** Requires GPU infrastructure, lower quality than GPT-4

## Testing AI Integration

### Unit Tests

```typescript
describe("AI Narrative Generation", () => {
  it("should include all source facts in prompt", () => {
    const facts = [{ label: "Test", value: "123" }];
    const prompt = buildPrompt(facts);
    expect(prompt).toContain("[Test]: 123");
  });

  it("should reject narratives with invalid citations", () => {
    const narrative = "Performance reached 80% [Unknown Metric]";
    const facts = [{ label: "Known", value: "80%" }];
    const result = validateNarrative(narrative, facts);
    expect(result.valid).toBe(false);
  });
});
```

### Integration Tests

1. Generate 10 sample reports
2. Validate all citations reference provided facts
3. Check narrative length (300-800 words)
4. Verify risk mentions align with thresholds

## Monitoring

Track these metrics:

- API latency (p50, p95, p99)
- Token usage per request
- Validation failure rate
- User satisfaction (thumbs up/down on generated text)

## Rollout Plan

1. **Phase 1**: Side-by-side (show both rule-based and AI)
2. **Phase 2**: A/B test with internal users
3. **Phase 3**: Default to AI with rule-based fallback
4. **Phase 4**: Deprecate rule-based for standard reports

## Security Considerations

- Never include PII in prompts (use school codes, not names)
- Log all LLM interactions for audit
- Rate-limit API route to prevent abuse
- Set max token limits to control costs
- Use environment variables for API keys (never commit)

## Compliance

Ensure LLM-generated text:
- Cites all facts from verified CSVs
- Does not hallucinate metrics
- Maintains audit trail (source facts logged)
- Can be regenerated deterministically from same inputs
