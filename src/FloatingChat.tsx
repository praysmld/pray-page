import { useState, useRef, useEffect, type FormEvent } from 'react'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'
import { profile } from './i18n'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'What are you working on now?',
  'Tell me about your RAG experience',
  'What is your stack?',
  'Are you open to new roles?',
]

const INITIAL_GREETING =
  `Hey, I'm ${profile.name}'s AI twin. Ask me anything about his career, projects, or AI engineering work.`

export default function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: INITIAL_GREETING },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next: Message[] = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply ?? '(no response)' }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I couldn't reach the API. For direct questions, email ${profile.email}.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[min(380px,calc(100vw-3rem))] h-[min(560px,calc(100vh-3rem))] bg-card border border-border rounded-2xl shadow-2xl shadow-primary/10 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-theme-r text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 font-display font-bold text-sm flex items-center justify-center">
                {profile.initials}
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-sm">Chat with {profile.name}</p>
                <p className="text-xs opacity-80">AI twin · ask anything</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1 hover:bg-white/10 rounded-md">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-card border border-border text-foreground rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border text-muted-foreground px-3.5 py-2.5 rounded-2xl rounded-bl-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-border bg-card">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-2.5 py-1 rounded-full bg-primary/5 text-foreground border border-primary/20 hover:bg-primary/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-center gap-2 p-3 border-t border-border bg-card">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
