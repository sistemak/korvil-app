'use client'

type VoiceWaveProps = {
  active: boolean
}

export function VoiceWave({ active }: VoiceWaveProps) {
  const bars = Array.from({ length: 32 })
  return (
    <div
      className="flex h-12 items-center justify-center gap-[3px]"
      aria-hidden="true"
    >
      {bars.map((_, i) => {
        const base = active
          ? 20 + Math.abs(Math.sin(i * 0.7)) * 70
          : 8 + Math.abs(Math.sin(i * 0.7)) * 10
        return (
          <span
            key={i}
            className="w-[3px] rounded-full bg-neon transition-[height,opacity] duration-150"
            style={{
              height: `${base}%`,
              opacity: active ? 0.9 : 0.35,
              animation: active
                ? `voicebar 0.9s ease-in-out ${i * 0.04}s infinite alternate`
                : 'none',
              boxShadow: active ? '0 0 8px rgba(0,245,255,0.7)' : 'none',
            }}
          />
        )
      })}
      <style jsx>{`
        @keyframes voicebar {
          0% {
            transform: scaleY(0.35);
          }
          100% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}
