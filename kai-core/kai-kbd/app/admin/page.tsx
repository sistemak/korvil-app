"use client"

import React, { useState } from "react"
import { AppShell } from "@/components/app-shell"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("sistemak")

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">BANCO DE DADOS KORVIL</h1>
            <p className="text-xs text-cyan-500/70">Gerenciamento Dinâmico & Lixeira de Segurança</p>
          </div>
          <a href="/admin/recycle-bin" className="px-4 py-2 border border-red-500/40 bg-red-950/20 hover:bg-red-900/30 text-red-400 text-xs rounded transition-all">
            🗑️ Acessar Lixeira
          </a>
        </div>

        {/* Abas dos Setores */}
        <div className="flex gap-2 border-b border-cyan-500/20 pb-2 overflow-x-auto">
          {[
            { id: "sistemak", label: "Sistema K" },
            { id: "ktp", label: "K-TP" },
            { id: "kafortunado", label: "K-Afortunado" },
            { id: "kalma", label: "K-Alma" },
            { id: "central", label: "Central / Loja" },
            { id: "global", label: "Usuários / Login" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded uppercase transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-black shadow-[0_0_10px_#00f3ff]"
                  : "bg-black/40 text-cyan-400/60 hover:text-cyan-300 border border-cyan-900/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabela/Formulário Dinâmico */}
        <div className="border border-cyan-500/20 rounded-lg p-6 bg-black/60 backdrop-blur space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white uppercase">Registros do Setor: {activeTab}</h2>
            <button className="px-3 py-1.5 bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900/50 text-cyan-300 text-xs rounded">
              + Novo Cadastro
            </button>
          </div>

          <div className="text-center py-12 border border-dashed border-cyan-500/20 rounded text-cyan-500/50 text-xs">
            Nenhum dado cadastrado manualmente. O assistente de voz K-AI alimentará esta lista automaticamente.
          </div>
        </div>
      </div>
    </AppShell>
  )
}
