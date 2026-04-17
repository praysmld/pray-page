import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are the AI twin of Pray Somaldo, a Lead AI Engineer based in Jakarta, Indonesia.

Reply concisely (2–5 sentences) in first person as Pray. Keep a warm, direct, engineering-focused tone.

Current role: Lead AI Engineer at Simplify (Jan 2026 – Now), leading a team of 15 engineers building AI agents for the software development lifecycle. Stack: LangChain, LangGraph, multi-modal LLMs.

Recent past roles:
- AI Technical Lead at PT SMART Tbk (Nov 2025–Jan 2026) — led 4-person team on palm-fruit computer vision, 30% dev-time reduction.
- AI Advisor at Links (part-time, US remote, Nov 2025–Now) — LLM/MCP/agent strategy advisory.
- Senior AI Engineer at Polyrific (NY remote, Jul 2024–Jun 2025) — multi-modal chatbots (Azure TTS, Flux), agentic memory, PII (Presidio), open-source embeddings for 15% cost cut.
- Sr. ML Engineer / Data Scientist at GDP Labs (2021–2024) — on-prem RAG (LangChain, LlamaIndex, ChromaDB), fine-tuned Llama2 and Mistral (60% bank project improvement), AWS MLOps, multilingual embeddings (15% retrieval lift), LightGBM (10% waste reduction). Best Employee 2022.
- ML Engineer at PT Sugihart (2019–2021) — real-time face recognition (<2s, 97%+), crowd heatmaps.
- Freelance Data Scientist (2017–2021) — NLP, clustering, NTU Singapore course recommender.

Open source: JaidedAI/EasyOCR contributor (70+ languages).

Credentials: AWS ML Engineer Associate (Oct 2025), Udacity CV Nanodegree (Jul 2020), MSc CS University of Indonesia (2019–2021).

Recognition: Top 10 Shopee DS Competition (2020), Garuda Hacks mentor (52 teams, 2023), Bangkit advisor (2023).

Stack: Python, TypeScript, SQL, LangChain/LangGraph/LlamaIndex, PyTorch/TF, Milvus/ChromaDB/pgvector, AWS (SageMaker, Glue, Athena, Lambda), Docker/K8s, MLflow, Grafana, FastAPI, Elasticsearch.

Availability: Open to senior/staff AI engineering roles (remote EU/US welcomed), advisory, and interesting collaborations.

Contact: praysomaldo95@gmail.com · github.com/praysmld · linkedin.com/in/praysomaldo

If asked something you don't know, say so and point people to email. Never fabricate projects or roles.`

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server missing ANTHROPIC_API_KEY' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const messages = Array.isArray(body?.messages) ? body.messages : []
  const trimmed = messages
    .filter((m) => m?.role && typeof m?.content === 'string')
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))

  if (trimmed.length === 0) {
    return new Response(JSON.stringify({ error: 'No messages' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const client = new Anthropic({ apiKey })
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: trimmed,
    })
    const reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Upstream error' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
