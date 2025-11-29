<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🚢 Portal de Jogos SENAI Vitória

**Uma plataforma para exibir e gerenciar os jogos desenvolvidos pelos alunos do curso de Desenvolvimento de Jogos Digitais do SENAI Vitória.**

</div>

## ✨ Funcionalidades

- 🎮 **Catálogo de Jogos** - Visualização de todos os projetos desenvolvidos
- 📝 **Devlogs** - Sistema de atualizações de desenvolvimento
- ⭐ **Reviews** - Avaliações da comunidade
- 👥 **Gestão de Alunos** - Cadastro e gerenciamento de estudantes
- 🔒 **Painel Admin** - Área restrita para administração
- 🌙 **Temas** - Alternância entre tema Porto e Retro
- ☁️ **Firebase** - Banco de dados e storage em nuvem

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Conta no Firebase (gratuita)

### 1. Clone e Instale

```bash
git clone https://github.com/andrensaraiva/PortalJogosSENAI.git
cd PortalJogosSENAI
npm install
```

### 2. Configure o Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Adicione um app Web
4. Ative os serviços:
   - **Firestore Database** (modo de teste para iniciar)
   - **Storage** (para upload de imagens)
   - **Authentication** (Email/Senha para admin)

5. Crie o arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 3. Execute Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🔐 Login Admin

**Modo Desenvolvimento (sem Firebase configurado):**
- Usuário: `admin`
- Senha: `senai123`

**Com Firebase:**
1. Crie um usuário no Firebase Authentication
2. Use email/senha para login

## 📦 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub à Vercel
2. Adicione as variáveis de ambiente
3. Deploy automático!

### Render
1. Conecte seu repositório
2. Use o arquivo `render.yaml` incluído
3. Adicione as variáveis de ambiente

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🏗️ Estrutura do Projeto

```
├── components/          # Componentes reutilizáveis
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── LoadingScreen.tsx
├── context/
│   └── GameContext.tsx  # Estado global + integração Firebase
├── firebase/
│   ├── config.ts        # Configuração Firebase
│   └── services.ts      # Funções CRUD
├── pages/               # Páginas da aplicação
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── GamePage.tsx
│   ├── SubmitProject.tsx
│   ├── AdminLogin.tsx
│   └── AdminDashboard.tsx
├── types.ts             # Tipos TypeScript
└── constants.ts         # Dados mockados
```

## 🛠️ Tecnologias

- **React 19** + TypeScript
- **Vite** - Build tool
- **React Router** - Navegação
- **Firebase** - Backend (Firestore, Storage, Auth)
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones

## 📝 Licença

MIT © SENAI Vitória

