"use client"

import React from "react"
import { AppShell } from "@/components/app-shell"

export default function RecycleBinPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
          <div>
            <h1 className="text-xl font-bold text-red-400 tracking-wider">🗑️ LIXEIRA DE RECUPERAÇÃO</h1>
            <p className="text-xs text-cyan-500/70">Todos os itens excluídos ficam armazenados aqui para restauração rápida.</p>
          </div>
          <a href="/admin" className="px-4 py-2 border border-cyan-500/40 text-cyan-300 text-xs rounded hover:bg-cyan-950/40">
            ← Voltar ao Banco
          </a>
        </div>

        <div className="border border-cyan-500/20 rounded-lg p-6 bg-black/60">
          <div className="text-center py-12 border border-dashed border-cyan-500/20 rounded text-cyan-500/50 text-xs">
            A lixeira está vazia no momento. Nenhum item foi excluído do repositório.
          </div>
        </div>
      </div>
    </AppShell>
  )
}
