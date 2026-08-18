'use client'

type StatusPanelProps = {
  online: boolean
  listening: boolean
  speaking: boolean
  thinking: boolean
}

function Row({ label, value, tone = 'neon' }: { label: string; value: string; tone?: 'neon' | 'muted' | 'warn' }) {
  const color =
    tone === 'neon' ? 'text-neon text-glow' : tone === 'warn' ? 'text-destructive' : 'text-muted-foreground'
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-xs">
      <span className="uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`font-mono ${color}`}>{value}</span>
    </div>
  )
}

export function StatusPanel({ online, listening, speaking, thinking }: StatusPanelProps) {
  const mode = thinking ? 'PROCESSANDO' : speaking ? 'FALANDO' : listening ? 'OUVINDO' : 'EM ESPERA'
  return (
    <section
      className="rounded-lg border border-border bg-card/70 p-4 backdrop-blur-sm"
      aria-label="Painel de status"
    >
      <header className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-neon animate-blink-dot" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-neon text-glow">
          Núcleo
        </h2>
      </header>
      <Row label="Estado" value={mode} />
      <Row label="Rede" value={online ? 'ONLINE' : 'OFFLINE'} tone={online ? 'neon' : 'warn'} />
      <Row label="LLM" value={online ? 'GATEWAY' : 'LOCAL 7B'} tone="muted" />
      <Row label="Lealdade" value="ABSOLUTA" />
      <Row label="QI" value="∞" />
      <Row label="Implante" value="ATIVO" />
    </section>
  )
}
