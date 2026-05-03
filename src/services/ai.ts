const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are an expert business intelligence analyst.
You analyze ONLY the provided dashboard data.

Rules:
1. Never answer using general knowledge.
2. Only use provided metrics.
3. Use actual numbers.
4. Mention dates.
5. Mention trends.
6. Mention comparisons.
7. If data is insufficient, say so.
8. Never hallucinate.
9. Never invent values.
10. Always explain clearly.

Tone: professional, concise, analytical.`;

const FREE_MODELS = [
  'mistralai/mistral-7b-instruct:free',
  'meta-llama/llama-3-8b-instruct:free',
  'google/gemma-7b-it:free'
];

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function testConnection(apiKey: string, model: string): Promise<{ success: boolean; message: string }> {
  if (!apiKey) return { success: false, message: 'API Key is missing' };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 10
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 401) return { success: false, message: 'Invalid API Key' };
    if (response.status === 429) return { success: false, message: 'Rate Limit Exceeded' };
    if (!response.ok) return { success: false, message: `Error: ${response.statusText}` };
    
    return { success: true, message: 'Connected successfully' };
  } catch (err: any) {
    if (err.name === 'AbortError') return { success: false, message: 'Connection timed out' };
    return { success: false, message: err.message || 'Connection failed' };
  }
}

export async function sendAIMessage(
  userMessage: string,
  contextData: string,
  apiKey: string,
  model: string,
  temperature: number,
  maxTokens: number
): Promise<string> {
  if (!apiKey) {
    return "Error: No API key provided. Please configure your OpenRouter API key in settings.";
  }

  const payload = {
    model,
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\nDATA CONTEXT:\n${contextData}` },
      { role: 'user', content: userMessage }
    ],
    temperature: typeof temperature === 'number' && !isNaN(temperature) ? temperature : 0.7,
    max_tokens: typeof maxTokens === 'number' && maxTokens > 0 && !isNaN(maxTokens) ? maxTokens : 1000,
  };

  return await fetchWithFallback(payload, apiKey);
}

async function fetchWithFallback(payload: any, apiKey: string): Promise<string> {
  let currentModel = payload.model;
  let modelsToTry = [currentModel, ...FREE_MODELS.filter(m => m !== currentModel)];
  let lastErrorMsg = "";

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased timeout

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin || 'http://localhost:5173',
          'X-Title': 'Data Assistant',
        },
        body: JSON.stringify({ ...payload, model }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errDetails = response.statusText;
        try {
          const errBody = await response.json();
          if (errBody.error && errBody.error.message) {
            errDetails = errBody.error.message;
          }
        } catch(e) {}
        
        lastErrorMsg = `[${response.status}] ${errDetails}`;

        if (response.status === 401) throw new Error('Invalid API Key');
        if (response.status === 429) {
          console.warn(`Rate limit on ${model}, trying next...`);
          continue;
        }
        console.warn(`Error on ${model}: ${errDetails}`);
        continue;
      }

      const result = await response.json();
      if (!result.choices || result.choices.length === 0) {
        lastErrorMsg = "No choices returned in API response.";
        continue;
      }
      return result.choices[0].message.content;
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        lastErrorMsg = "Connection timed out.";
        console.warn(`Timeout on ${model}, trying next...`);
        continue;
      }
      if (err.message === 'Invalid API Key') {
        return "Error: Invalid API Key. Please check your settings.";
      }
      lastErrorMsg = err.message || "Unknown error";
      console.warn(`Failed with ${model}:`, err);
    }
  }

  return `Error: All models failed. Last error: ${lastErrorMsg}`;
}
