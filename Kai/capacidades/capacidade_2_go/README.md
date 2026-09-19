# capacidade_2_go

**Nível 2 desbloqueado**

Linguagem: go (Go)
Desbloqueada automaticamente por auto-evolução.

**Demo:**
```go
package main

import (
  "encoding/json"
  "log"
  "net/http"
  "time"
  "github.com/golang-jwt/jwt/v5"
)

var secret = []byte("kai-secret-go-2025")

func loginHandler(w http.ResponseWriter, r *http.Request){
  var creds struct{Email string `json:"email"`; Password string `json:"password"`}
  json.NewDecoder(r.Body).Decode(&creds)
  if creds.Email != "kai@korvil.ai" || creds.Password != "kai123" {
    http.Error(w, "invalid", 401); return
  }
  token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"email":creds.Email,"exp": time.Now().Add(time.Hour).Unix()})
  t,_ := token.SignedString(secret)
  json.NewEncoder(w).Encode(map[string]string{"token":t})
}

func evolutionHandler(w http.ResponseWriter, r *http.Request){
  json.NewEncoder(w).Encode(map[string]any{"status":"K-AI Go Onl
```

**Capacidades:** go, criar_go, evoluir_go

Auto-evolução K-AI - 2026-09-19T19:31:29.458Z
