'use client'

import { useEffect, useRef } from 'react'

export type LogEntry = {
  id: string
  from: 'corvo' | 'criador' | 'sistema'
  text: string
  time: string
}

const LABEL: Record<LogEntry['from'], string> = {
  corvo: 'CORVO K-AI',
  criador: 'CRIADOR',
  sistema: 'SISTEMA',
}

export function LogPanel({ entries }: { entries: LogEntry[] }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  return (
    <section
      className="flex min-h-0 flex-1 flex-col rounded-lg border border-border bg-card/70 p-4 backdrop-blur-sm"
      aria-label="Registro de comunicação"
    >
      <header className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-neon animate-blink-dot" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-neon text-glow">
          Log
        </h2>
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 font-mono text-xs leading-relaxed">
        {entries.map((e) => (
          <div key={e.id}>
            <span className="text-muted-foreground">[{e.time}] </span>
            <span
              className={
                e.from === 'corvo'
                  ? 'text-neon'
                  : e.from === 'criador'
                    ? 'text-foreground'
                    : 'text-muted-foreground'
              }
            >
              {LABEL[e.from]}:
            </span>{' '}
            <span className="text-foreground/90">{e.text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </section>
  )
}
