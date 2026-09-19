#!/bin/bash
# K-AI Shell - JWT Auth Generator
SECRET="kai-secret-shell-2025"
EMAIL="kai@korvil.ai"

generate_jwt(){
  header=$(echo -n '{"alg":"HS256","typ":"JWT"}' | base64 | tr -d '=' | tr '/+' '_-')
  payload=$(echo -n "{\"email\":\"$EMAIL\",\"exp\":$(($(date +%s)+3600))}" | base64 | tr -d '=' | tr '/+' '_-')
  signature=$(echo -n "$header.$payload" | openssl dgst -sha256 -hmac "$SECRET" -binary | base64 | tr -d '=' | tr '/+' '_-')
  echo "$header.$payload.$signature"
}

echo "K-AI Shell Online - JWT Generator"
TOKEN=$(generate_jwt)
echo "Token: $TOKEN"
echo '{"status":"K-AI Shell","neurons":512}'