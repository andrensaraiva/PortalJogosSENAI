# Portal de Jogos SENAI - Configuração para Render.com

## Deploy Automático

1. Faça push do seu código para o GitHub
2. Acesse https://render.com e crie uma conta
3. Clique em "New +" > "Static Site"
4. Conecte seu repositório GitHub
5. Configure:
   - **Name**: portal-jogos-senai
   - **Branch**: main
   - **Build Command**: npm install && npm run build
   - **Publish Directory**: dist
6. Adicione as variáveis de ambiente (Environment Variables):
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID

## Configuração do render.yaml (abaixo)
Se preferir usar o arquivo render.yaml, o deploy será automático ao fazer push.
