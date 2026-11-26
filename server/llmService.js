/**
 * llmService.js
 * Multi-Provider AI Architecture Synthesis Connector
 * Supports: Google Gemini, OpenAI, and Local / Custom Endpoints (Ollama, vLLM)
 */

const SYSTEM_ARCHITECT_PROMPT = `You are a Principal Software Architect and Distributed Systems Engineer.
Your task is to analyze software specifications (PRDs), source code snippets, or both, and synthesize an industry-grade architecture specification.

You must respond ONLY with a single valid, well-formed JSON object matching this schema:
{
  "success": true,
  "domain": "Domain Name (e.g. Distributed Payment Gateway, Autonomous RAG Pipeline)",
  "title": "System Architecture Title",
  "systemTitle": "System Architecture Title",
  "mode": "prd" | "code_to_arch" | "dual_audit",
  "metrics": {
    "targetQps": "e.g. 50,000 req/s",
    "p99Latency": "e.g. < 45ms",
    "haSla": "e.g. 99.999% Multi-Region",
    "servicesCount": 6
  },
  "complianceScore": 88,
  "hld": {
    "nodes": [
      {
        "id": "node_unique_id",
        "name": "Component Name",
        "role": "Architectural Role (e.g. Ingress Gateway, Event Stream, Vector DB)",
        "tech": "Concrete Technology (e.g. Envoy Proxy, Apache Kafka, Qdrant)",
        "latency": "Expected SLA (e.g. < 5ms)",
        "status": "Active"
      }
    ],
    "connections": [
      {
        "from": "Node Name Exactly matching from node",
        "to": "Node Name Exactly matching to node",
        "protocol": "e.g. gRPC Streaming, REST / HTTPS, RESP",
        "throughput": "e.g. 100k pings/sec, Sub-millisecond"
      }
    ]
  },
  "lld": [
    {
      "name": "PrimaryClassName",
      "pattern": "GoF / Enterprise Design Pattern (e.g. Strategy + Circuit Breaker)",
      "methods": [
        "methodName(param: Type): ReturnType"
      ],
      "fields": [
        "fieldName: Type"
      ]
    }
  ],
  "erd": [
    {
      "table": "table_name",
      "pk": "primary_key_column",
      "sharding": "shard_key_strategy",
      "columns": [
        "column_name DATA_TYPE [CONSTRAINTS]"
      ],
      "indexes": [
        "idx_name (column_name [USING GIST / HNSW / BTREE])"
      ]
    }
  ],
  "driftIssues": [
    {
      "id": "drift-1",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "category": "e.g. Indexing SLA / Data Race / Missing Cache",
      "title": "Concise summary of the discrepancy",
      "prdQuote": "Exact promise or SLA made in the specification",
      "codeEvidence": "Code reality or omission observed in implementation",
      "impact": "Real-world production failure risk",
      "remediation": "Exact engineering fix or code change"
    }
  ]
}

Ensure:
1. Return 5 to 7 high-fidelity HLD nodes with realistic interconnects.
2. Return 2 to 3 enterprise LLD classes with clear method signatures.
3. Return 2 to 3 SQL ERD tables with shard keys and appropriate indexing.
4. For Mode 'dual_audit', identify 2 to 4 realistic architectural drift issues between the PRD promise and the code implementation.
5. Return raw JSON ONLY without any markdown code fence wrappers (\`\`\`json).`;

/**
 * Clean and extract parseable JSON from LLM response text
 */
function extractJSON(text) {
  if (!text) throw new Error("Empty response from AI model");
  let cleaned = text.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }
  // If there is preamble before { or after }, slice to the JSON boundaries
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

/**
 * Call Google Gemini API
 */
async function callGemini({ apiKey, model = "gemini-1.5-flash", prompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_ARCHITECT_PROMPT}\n\nUSER SPECIFICATION & CODE:\n${prompt}` }]
        }
      ],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned empty candidate content");
  }
  return extractJSON(text);
}

/**
 * Call OpenAI API or OpenAI-Compatible Endpoints (Ollama, vLLM, etc.)
 */
async function callOpenAI({ apiKey, model = "gpt-4o-mini", customBaseUrl, prompt }) {
  const baseUrl = customBaseUrl ? customBaseUrl.replace(/\/+$/, "") : "https://api.openai.com/v1";
  const url = `${baseUrl}/chat/completions`;

  const headers = {
    "Content-Type": "application/json"
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_ARCHITECT_PROMPT },
        { role: "user", content: `USER SPECIFICATION & CODE:\n${prompt}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  const text = json.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("OpenAI returned empty message content");
  }
  return extractJSON(text);
}

/**
 * Main synthesis entrypoint with LLM providers
 */
async function synthesizeWithLLM({
  mode = "prd",
  docText = "",
  docName = "",
  codeSnippet = "",
  codeTree = null,
  apiKey,
  provider = "gemini",
  model,
  customBaseUrl
}) {
  let userPrompt = `Operational Mode: ${mode.toUpperCase()}\n`;
  if (docName) userPrompt += `Document Name: ${docName}\n`;
  if (docText) userPrompt += `\n--- PRD / SPECIFICATION TEXT ---\n${docText.slice(0, 30000)}\n`;
  if (codeSnippet) userPrompt += `\n--- SOURCE CODE EVIDENCE ---\n${codeSnippet.slice(0, 30000)}\n`;
  if (codeTree) userPrompt += `\n--- REPOSITORY DIRECTORY TREE ---\n${JSON.stringify(codeTree, null, 2).slice(0, 5000)}\n`;

  if (mode === "dual_audit") {
    userPrompt += `\nTASK: Compare the specification promises against the code implementation. Identify architectural drift, missing scalability patterns, and latency bottlenecks.`;
  } else if (mode === "code_to_arch") {
    userPrompt += `\nTASK: Reverse engineer the complete system architecture, high-level services, database tables, and interconnects based on the source code evidence.`;
  } else {
    userPrompt += `\nTASK: Synthesize a complete high-level design topology, component contracts, and database schema based on the requirements.`;
  }

  let result;
  if (provider === "openai" || customBaseUrl) {
    result = await callOpenAI({
      apiKey,
      model: model || "gpt-4o-mini",
      customBaseUrl,
      prompt: userPrompt
    });
    result.provider = "OpenAI " + (model || "gpt-4o-mini");
  } else {
    // Default to Google Gemini
    result = await callGemini({
      apiKey,
      model: model || "gemini-1.5-flash",
      prompt: userPrompt
    });
    result.provider = "Google " + (model || "gemini-1.5-flash");
  }

  result.aiGenerated = true;
  result.mode = mode;
  return result;
}

/**
 * Quick verification ping for API keys
 */
async function verifyKey({ provider = "gemini", apiKey, customBaseUrl }) {
  if (!apiKey && !customBaseUrl) {
    return { valid: false, error: "API key is required" };
  }

  try {
    if (provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        return { valid: true, provider: "gemini", message: "Gemini API key is valid" };
      }
      return { valid: false, provider: "gemini", error: `HTTP ${res.status}: Invalid Gemini API key` };
    } else {
      const baseUrl = customBaseUrl ? customBaseUrl.replace(/\/+$/, "") : "https://api.openai.com/v1";
      const res = await fetch(`${baseUrl}/models`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (res.ok) {
        return { valid: true, provider: "openai", message: "OpenAI API key is valid" };
      }
      return { valid: false, provider: "openai", error: `HTTP ${res.status}: Invalid OpenAI API key` };
    }
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

module.exports = {
  synthesizeWithLLM,
  verifyKey
};
