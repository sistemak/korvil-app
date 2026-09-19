// Sistema de Login K-AI
export function validateLogin(user, pass){
  if(user.includes("@") && pass.length>=6) return { ok:true, token:"kai_"+Date.now() };
  return { ok:false, error:"Credenciais inválidas" }
}