"use client"

import React, { useState } from "react"
import { AppShell } from "@/components/app-shell"

export default function HomePage() {
  const [logs] = useState<string[]>([
    "[SYSTEM] Core KAI-KBD inicializado com sucesso.",
    "[STORAGE] LocalStorage e IndexedDB conectados.",
    "[SYNC] Fila de commits GitHub pronta para korvilp-sudo/korvil-app.",
    "[VOICE] Assistente de voz em escuta passiva ('K-AI', 'Kai', 'Caio')."
  ])

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Painel de Status / Exp Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "SISTEMA K", status: "Ativo", count: "12 Métodos", color: "border-cyan-500" },
            { title: "K-TP", status: "Sincronizado", count: "48 Treinos", color: "border-cyan-500" },
            { title: "K-AFORTUNADO", status: "Ativo", count: "8 Planos", color: "border-cyan-500" },
            { title: "K-ALMA", status: "Ativo", count: "15 Meditações", color: "border-cyan-500" },
          ].map((sector, i) => (
            <div key={i} className={`p-4 rounded-lg border ${sector.color} bg-black/60 backdrop-blur shadow-[0_0_15px_rgba(0,243,255,0.05)]`}>
              <h3 className="text-xs text-cyan-400/70 uppercase tracking-wider">{sector.title}</h3>
              <p className="text-lg font-bold text-white mt-1">{sector.count}</p>
              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {sector.status}
              </span>
            </div>
          ))}
        </div>

        {/* Terminal de Comando / K-AI HUD */}
        <div className="border border-cyan-500/30 rounded-lg p-6 bg-black/80 shadow-[0_0_30px_rgba(0,243,255,0.1)] space-y-4">
          <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3">
            <h2 className="text-sm font-bold text-cyan-300 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              TERMINAL K-AI DE VOZ & AUTOMAÇÃO
            </h2>
            <span className="text-xs text-cyan-500/60">Modo Forja Autónomo</span>
          </div>

          <div className="bg-black/90 p-4 rounded border border-cyan-950 font-mono text-xs text-cyan-400 space-y-2 h-48 overflow-y-auto">
            {logs.map((log, index) => (
              <p key={index} className="leading-relaxed opacity-90">{log}</p>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded tracking-wider uppercase text-xs transition-all shadow-[0_0_15px_#00f3ff] active:scale-95">
              🎙️ Ativar Escuta por Voz (K-AI)
            </button>
            <a href="/admin" className="px-6 py-3 border border-cyan-500/50 hover:bg-cyan-950/50 text-cyan-300 font-bold rounded text-xs tracking-wider uppercase transition-all flex items-center justify-center">
              Gerenciar Banco de Dados
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
