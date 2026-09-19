import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const SECRET = process.env.JWT_SECRET || 'kai-ts-secret';

interface UserPayload { id:number; email:string }

function auth(req: Request & {user?: UserPayload}, res: Response, next: NextFunction){
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({error:'No token'});
  try{ req.user = jwt.verify(token, SECRET) as UserPayload; next(); }
  catch{ return res.status(401).json({error:'Invalid'}); }
}

app.post('/api/login', (req: Request, res: Response)=>{
  const {email,password} = req.body as {email:string,password:string};
  if(email==='kai@korvil.ai' && password==='kai123'){
    const token = jwt.sign({id:1,email}, SECRET, {expiresIn:'1h'});
    return res.json({token});
  }
  return res.status(401).json({error:'Invalid'});
});

app.get('/api/evolution', auth, (req: Request & {user?: UserPayload}, res: Response)=>{
  res.json({status:'K-AI TS Online', neurons:512, user:req.user});
});

app.listen(3000, ()=> console.log('K-AI TS http://localhost:3000'));