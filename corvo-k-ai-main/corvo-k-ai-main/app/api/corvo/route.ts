import { generateText } from 'ai'
import { CORVO_SYSTEM_PROMPT } from '@/lib/corvo-persona'
import { responderOffline } from '@/lib/corvo-offline'

export const maxDuration = 30

type Turn = { role: 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  try {
    const { comando_voz, historico = [] } = (await req.json()) as {
      comando_voz?: string
      historico?: Turn[]
    }

    if (!comando_voz || typeof comando_voz !== 'string') {
      return Response.json(
        { status: 'erro', texto: 'Comando de voz ausente, CRIADOR K-RIADOR.' },
        { status: 400 },
      )
    }

    const messages: Turn[] = [
      ...historico.slice(-8),
      { role: 'user', content: comando_voz },
    ]

    try {
      const { text } = await generateText({
        model: 'openai/gpt-5.1-instant',
        system: CORVO_SYSTEM_PROMPT,
        messages,
      })

      return Response.json({
        status: 'executado',
        modo: 'online',
        texto: text,
        criador: 'K-RIADOR',
      })
    } catch (aiError) {
      // LEI 1: ONLINE E OFFLINE. Se o núcleo online falhar, cai para o cérebro local.
      console.log('[v0] Núcleo online indisponível, usando modo local:', (aiError as Error).message)
      return Response.json({
        status: 'executado',
        modo: 'offline',
        texto: responderOffline(comando_voz),
        criador: 'K-RIADOR',
      })
    }
  } catch (error) {
    console.log('[v0] Erro na rota /api/corvo:', (error as Error).message)
    return Response.json(
      {
        status: 'erro',
        texto:
          'Perdão, CRIADOR K-RIADOR. Encontrei uma falha crítica. Verifique o núcleo e tente novamente.',
      },
      { status: 500 },
    )
  }
}
