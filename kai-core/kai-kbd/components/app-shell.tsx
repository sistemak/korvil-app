"use client"

import React from "react"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Grid Cibernético 8K de Fundo */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00f3ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00f3ff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      
      {/* Brilho Radial Cyberpunk */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />

      {/* Header HUD */}
      <header className="relative z-10 border-b border-cyan-500/20 bg-black/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f3ff]" />
          <h1 className="text-xl font-bold tracking-widest text-white uppercase">
            KAI<span className="text-cyan-400">-KBD</span> <span className="text-xs text-cyan-500/60">v8.0 OS</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="px-3 py-1 rounded border border-cyan-500/30 bg-cyan-950/30 text-cyan-300">
            CORE: ONLINE
          </span>
          <span className="px-3 py-1 rounded border border-emerald-500/30 bg-emerald-950/30 text-emerald-400">
            GITHUB: READY
          </span>
        </div>
      </header>

      {/* Conteúdo da Aplicação */}
      <main className="relative z-10 container mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
