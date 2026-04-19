import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

const RATE_LIMIT = 5
const RATE_WINDOW_SECONDS = 600

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

function getClientIp(req) {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}

async function sha256Hex(input) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function jsonResponse(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return jsonResponse(500, { error: 'Server missing ANTHROPIC_API_KEY' })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' })
  }

  const messages = Array.isArray(body?.messages) ? body.messages : []
  const trimmed = messages
    .filter((m) => m?.role && typeof m?.content === 'string')
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))

  if (trimmed.length === 0) {
    return jsonResponse(400, { error: 'No messages' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })
      const ipHash = await sha256Hex(getClientIp(req))
      const { data, error } = await supabase.rpc('chat_rate_limit_check', {
        p_ip_hash: ipHash,
        p_limit: RATE_LIMIT,
        p_window_seconds: RATE_WINDOW_SECONDS,
      })
      if (error) {
        console.warn('[chat] rate-limit check failed, failing open:', error.message)
      } else {
        const row = Array.isArray(data) ? data[0] : data
        if (row && !row.allowed) {
          const retryAfter = row.retry_after_seconds ?? RATE_WINDOW_SECONDS
          return jsonResponse(
            429,
            { error: 'rate_limited', retryAfter },
            { 'Retry-After': String(retryAfter) },
          )
        }
      }
    } catch (err) {
      console.warn('[chat] rate-limit threw, failing open:', err?.message ?? err)
    }
  }

  const client = new Anthropic({ apiKey })
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: trimmed,
    })
    const reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()
    return jsonResponse(200, { reply })
  } catch (err) {
    return jsonResponse(502, { error: err?.message ?? 'Upstream error' })
  }
}
