'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type UseVoiceOptions = {
  onResult?: (text: string) => void
}

export function useVoice({ onResult }: UseVoiceOptions = {}) {
  const [supported, setSupported] = useState(true)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const recognitionRef = useRef<any>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult

  // Pick the best available pt-BR (preferably male) voice.
  const pickVoice = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const voices = window.speechSynthesis.getVoices()
    const pt = voices.filter((v) => v.lang.toLowerCase().startsWith('pt'))
    const maleHints = ['male', 'homem', 'daniel', 'felipe', 'ricardo', 'antonio', 'joão', 'google']
    const male = pt.find((v) => maleHints.some((h) => v.name.toLowerCase().includes(h)))
    voiceRef.current = male ?? pt[0] ?? voices[0] ?? null
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR || !window.speechSynthesis) {
      setSupported(false)
      return
    }

    const recognition = new SR()
    recognition.lang = 'pt-BR'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim()
      if (transcript) onResultRef.current?.(transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition

    pickVoice()
    window.speechSynthesis.onvoiceschanged = pickVoice

    return () => {
      try {
        recognition.stop()
      } catch {}
      window.speechSynthesis.cancel()
    }
  }, [pickVoice])

  const startListening = useCallback(() => {
    const rec = recognitionRef.current
    if (!rec || listening) return
    try {
      window.speechSynthesis?.cancel()
      setSpeaking(false)
      rec.start()
      setListening(true)
    } catch {}
  }, [listening])

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {}
    setListening(false)
  }, [])

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        onEnd?.()
        return
      }
      window.speechSynthesis.cancel()
      if (!voiceRef.current) pickVoice()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'pt-BR'
      if (voiceRef.current) utter.voice = voiceRef.current
      utter.pitch = 0.9
      utter.rate = 1.02
      utter.volume = 1
      utter.onstart = () => setSpeaking(true)
      utter.onend = () => {
        setSpeaking(false)
        onEnd?.()
      }
      utter.onerror = () => {
        setSpeaking(false)
        onEnd?.()
      }
      window.speechSynthesis.speak(utter)
    },
    [pickVoice],
  )

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  return { supported, listening, speaking, startListening, stopListening, speak, stopSpeaking }
}
