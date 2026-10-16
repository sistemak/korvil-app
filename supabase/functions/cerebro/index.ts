import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
serve(async (req)=>{
  const {pedido} = await req.json()
  const GROQ=Deno.env.get("GROQ_API_KEY")
  const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${GROQ}`,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"user",content:pedido}]})})
  const j=await r.json()
  return new Response(JSON.stringify({resposta:j.choices[0].message.content}),{headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"}})
})
