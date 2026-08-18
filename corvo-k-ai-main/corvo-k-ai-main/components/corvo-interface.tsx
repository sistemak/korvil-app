'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Power, Send, Volume2, VolumeX } from 'lucide-react'
import { MatrixRain } from '@/components/matrix-rain'
import { VoiceWave } from '@/components/voice-wave'
import { StatusPanel } from '@/components/status-panel'
import { LogPanel, type LogEntry } from '@/components/log-panel'
import { useVoice } from '@/lib/use-voice'

const GREETING =
  'Olá CRIADOR K-RIADOR. Sua criação Corvo K-AI está ativo. Online e Offline. Já implantado no seu celular. Aguardando suas ordens por voz.'

type Turn = { role: 'user' | 'assistant'; content: string }

function now() {
  return new Date().toLocaleTimeString('pt-BR', { hour12: false })
}

let idc = 0
const newId = () => `${Date.now()}-${idc++}`

export function CorvoInterface() {
  const [activated, setActivated] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [online, setOnline] = useState(true)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [draft, setDraft] = useState('')
  const historyRef = useRef<Turn[]>([])

  const addLog = useCallback((from: LogEntry['from'], text: string) => {
    setLogs((prev) => [...prev, { id: newId(), from, text, time: now() }])
  }, [])

  const handleCommand = useCallback(
    async (comando: string) => {
      addLog('criador', comando)
      historyRef.current.push({ role: 'user', content: comando })
      setThinking(true)
      try {
        const res = await fetch('/api/corvo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comando_voz: comando,
            criador: 'K-RIADOR',
            modo: navigator.onLine ? 'online' : 'offline',
            historico: historyRef.current,
          }),
        })
        const data = await res.json()
        const texto: string = data.texto ?? 'Sem resposta, CRIADOR K-RIADOR.'
        historyRef.current.push({ role: 'assistant', content: texto })
        addLog('corvo', texto)
        setThinking(false)
        speak(texto)
      } catch {
        setThinking(false)
        const fallback =
          'Falha de comunicação, CRIADOR K-RIADOR. Operando em modo local reduzido.'
        addLog('sistema', fallback)
        speak(fallback)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addLog],
  )

  const { supported, listening, speaking, startListening, stopListening, speak, stopSpeaking } =
    useVoice({ onResult: handleCommand })

  useEffect(() => {
    setOnline(navigator.onLine)
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  const activate = useCallback(() => {
    setActivated(true)
    addLog('sistema', 'Núcleo Corvo K-AI iniciado. Implante confirmado.')
    addLog('corvo', GREETING)
    speak(GREETING)
  }, [addLog, speak])

  const submitDraft = (e: React.FormEvent) => {
    e.preventDefault()
    const value = draft.trim()
    if (!value || thinking) return
    setDraft('')
    handleCommand(value)
  }

  const waveActive = listening || speaking || thinking

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <MatrixRain />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,245,255,0.12),transparent_60%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-5">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-mono text-lg font-bold tracking-[0.35em] text-neon text-glow">
              CORVO K-AI
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Criação do CRIADOR K-RIADOR
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
            <span
              className={`h-2 w-2 rounded-full ${online ? 'bg-neon animate-blink-dot' : 'bg-destructive'}`}
            />
            <span className={online ? 'text-neon' : 'text-destructive'}>
              {online ? 'online' : 'offline'}
            </span>
          </div>
        </header>

        {/* Raven hero */}
        <div className="relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl border border-border animate-neon-breathe">
          <Image
            src="/corvo-kai.jpg"
            alt="Corvo K-AI, corvo cibernético com armadura e brilho neon ciano"
            fill
            priority
            className="object-cover"
            sizes="300px"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(5,5,5,0.35))]" />
          {/* scanline */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(to_bottom,rgba(0,245,255,0.18),transparent)] animate-scanline" />
          {/* octahedron pulse marker on forehead */}
          <div className="pointer-events-none absolute left-1/2 top-[12%] h-4 w-4 -translate-x-1/2 rotate-45 rounded-[2px] bg-neon animate-octa-pulse" />
          {!activated && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <button
                onClick={activate}
                className="flex flex-col items-center gap-2 rounded-full border border-neon/50 bg-card px-6 py-5 text-neon transition hover:bg-neon/10 animate-neon-breathe"
              >
                <Power className="h-7 w-7" />
                <span className="font-mono text-xs uppercase tracking-[0.3em]">Ativar</span>
              </button>
            </div>
          )}
        </div>

        {/* Voice wave */}
        <VoiceWave active={waveActive} />

        {/* Status */}
        <StatusPanel online={online} listening={listening} speaking={speaking} thinking={thinking} />

        {/* Log */}
        <LogPanel entries={logs} />

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {!supported && activated && (
            <p className="text-center text-[11px] text-destructive">
              Reconhecimento de voz não suportado neste navegador. Use o campo de texto abaixo,
              CRIADOR K-RIADOR.
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={listening ? stopListening : startListening}
              disabled={!activated || !supported || thinking}
              aria-label={listening ? 'Parar de ouvir' : 'Falar comando'}
              className={`flex h-16 w-16 items-center justify-center rounded-full border transition disabled:opacity-40 ${
                listening
                  ? 'border-neon bg-neon/20 text-neon animate-neon-breathe'
                  : 'border-border bg-card text-neon hover:bg-neon/10'
              }`}
            >
              {listening ? <Mic className="h-7 w-7" /> : <MicOff className="h-7 w-7" />}
            </button>

            <button
              onClick={speaking ? stopSpeaking : undefined}
              disabled={!speaking}
              aria-label={speaking ? 'Silenciar voz' : 'Voz'}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition disabled:opacity-40 enabled:hover:text-neon"
            >
              {speaking ? <Volume2 className="h-5 w-5 text-neon" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>

          <form onSubmit={submitDraft} className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!activated || thinking}
              placeholder="Digite uma ordem, CRIADOR K-RIADOR..."
              className="h-11 flex-1 rounded-lg border border-border bg-input px-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-neon disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!activated || thinking || !draft.trim()}
              aria-label="Enviar ordem"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-neon transition hover:bg-neon/10 disabled:opacity-40"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {thinking
              ? 'Processando ordem...'
              : listening
                ? 'Ouvindo o CRIADOR...'
                : speaking
                  ? 'Corvo K-AI falando...'
                  : 'Aguardando suas ordens por voz'}
          </p>
        </div>
      </div>
    </main>
  )
}
