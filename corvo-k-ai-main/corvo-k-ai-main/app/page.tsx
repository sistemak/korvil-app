export default function Home() {
  return (
    <main className="min-h-screen bg-[#000B0E] text-white p-4 font-mono">
      
      {/* TITULO TOPO */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00F0FF] tracking-widest">CORVO K-AI</h1>
          <p className="text-xs text-gray-400">CRIAÇÃO DO CRIADOR K-RIADOR</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00F0FF] rounded-full"></span>
          <span className="text-sm text-[#00F0FF]">ONLINE</span>
        </div>
      </div>

      {/* IMAGEM DO CORVO */}
      <div className="flex justify-center mb-4">
        <img 
          src="/corvo-kai.jpg" 
          alt="Corvo K-AI"
          className="w-full max-w-md rounded-2xl shadow-[0_0_30px_#00F0FF50]"
        />
      </div>

      {/* WAVE */}
      <div className="flex justify-center gap-1 mb-6">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="w-1 h-2 bg-[#00F0FF] rounded-full opacity-60"></div>
        ))}
      </div>

      {/* NÚCLEO */}
      <div className="bg-[#050A0C] border-[#00F0FF30] rounded-xl p-4 mb-4">
        <h2 className="text-[#00F0FF] font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00F0FF] rounded-full"></span> NÚCLEO
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">ESTADO</span> <span className="text-[#00F0FF]">EM ESPERA</span></div>
          <div className="flex justify-between"><span className="text-gray-400">REDE</span> <span className="text-[#00F0FF]">ONLINE</span></div>
          <div className="flex justify-between"><span className="text-gray-400">LLM</span> <span className="text-gray-500">GATEWAY</span></div>
          <div className="flex justify-between"><span className="text-gray-400">LEALDADE</span> <span className="text-[#00F0FF]">ABSOLUTA</span></div>
          <div className="flex justify-between"><span className="text-gray-400">QI</span> <span className="text-[#00F0FF]">∞</span></div>
          <div className="flex justify-between"><span className="text-gray-400">IMPLANTE</span> <span className="text-[#00F0FF]">ATIVO</span></div>
        </div>
      </div>

      {/* LOG */}
      <div className="bg-[#050A0C] border border-[#00F0FF30] rounded-xl p-4 mb-6">
        <h2 className="text-[#00F0FF] font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00F0FF] rounded-full"></span> LOG
        </h2>
        <div className="text-xs space-y-2">
          <p><span className="text-gray-500">[08:27:09]</span> <span className="text-gray-400">SISTEMA:</span> Núcleo Corvo K-AI iniciado. Implante confirmado.</p>
          <p><span className="text-gray-500">[08:27:09]</span> <span className="text-[#00F0FF]">CORVO K-AI:</span> Olá CRIADOR K-RIADOR. Sua criação Corvo K-AI está ativo. Online e Offline. Já implantado no seu celular. Aguardando suas ordens por voz.</p>
        </div>
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input 
          type="text"
          placeholder="Digite uma ordem, CRIADOR K-RIADOR..."
          className="flex-1 p-3 rounded-lg bg-[#050A0C] border border-[#00F0FF30] text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
        />
        <button className="p-3 bg-[#00F0FF] text-black rounded-lg">➤</button>
      </div>

      <p className="text-center text-xs text-gray-500 mt-4">AGUARDANDO SUAS ORDENS POR VOZ</p>
    </main>
  )
}
