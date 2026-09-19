from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
import uvicorn

SECRET_KEY = "kai-secret-key-09f3b2e1"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="K-AI Generated API", version="1.0.0")

fake_users_db = {
    "kai@korvil.ai": {"username":"kai@korvil.ai","hashed_password": pwd_context.hash("kai123")}
}

class Token(BaseModel):
    access_token: str
    token_type: str

def create_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect credentials")
    token = create_token(data={"sub": user["username"]}, expires_delta=timedelta(minutes=60))
    return {"access_token": token, "token_type": "bearer"}

@app.get("/")
async def root():
    return {"status":"K-AI Python Online","engine":"FastAPI","docs":"/docs","neurons":512}

@app.get("/api/evolution")
async def evolution(token: str = Depends(oauth2_scheme)):
    return {"level":"autonomous","neurons":512}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)