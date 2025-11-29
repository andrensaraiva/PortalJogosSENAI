<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🚢 Portal de Jogos SENAI Vitória

**Uma plataforma para exibir e gerenciar os jogos desenvolvidos pelos alunos do curso de Desenvolvimento de Jogos Digitais do SENAI Vitória.**

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Firebase](https://img.shields.io/badge/Database-Firebase-orange?logo=firebase)](https://firebase.google.com)

</div>

---

## ✨ Funcionalidades

- 🎮 **Catálogo de Jogos** - Visualização de todos os projetos desenvolvidos
- 📝 **Devlogs com Mídia** - Sistema de atualizações com suporte a imagens, GIFs, vídeos e links
- ⭐ **Reviews** - Avaliações da comunidade
- 👥 **Gestão de Alunos** - Cadastro por turma/cohort
- 🔒 **Painel Admin** - Área restrita para administração
- 🎯 **Submissão de Projetos** - Alunos podem enviar seus jogos
- 🌙 **Temas** - Alternância entre tema Porto e Retro
- ☁️ **Firebase Firestore** - Banco de dados em nuvem

---

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
4. Ative o **Firestore Database**

5. Crie o arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

6. **Configure as regras do Firestore** no Console Firebase > Firestore > Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow read: if true;
      allow write: if true;
    }
    match /students/{studentId} {
      allow read: if true;
      allow write: if true;
    }
    match /cohorts/{cohortId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### 3. Execute Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 🔐 Sistema de Login

### Admin
- **Usuário:** `admin`
- **Senha:** `senai123`
- Acesso via: `/admin`

### Alunos
- Login com credenciais cadastradas no sistema
- Podem submeter e editar seus próprios projetos

---

## 📁 Estrutura de Dados

### Coleções do Firestore

| Coleção | Descrição |
|---------|-----------|
| `games` | Jogos/Projetos cadastrados |
| `students` | Alunos registrados |
| `cohorts` | Turmas/Semestres |

### Funcionalidades de Imagem

> ⚠️ **Importante:** Este projeto **NÃO usa Firebase Storage**. 
> 
> Todas as imagens devem ser hospedadas externamente (Imgur, ImgBB, etc.) e apenas os links são salvos no banco.

---

## 📸 Como Adicionar Imagens

O sistema possui botões de ajuda "Como fazer?" que explicam:

### Para Jogos (WebGL)
- **Itch.io** - Upload do build e usar link embed
- **GitHub Pages** - Hospedar gratuitamente
- **Google Drive** - Para downloads

### Para Imagens
- **Imgur** - Upload simples, copiar link direto
- **ImgBB** - Alternativa ao Imgur
- **PostImages** - Outra opção gratuita

---

## 🎮 Páginas do Sistema

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Home - Carrossel e destaques | Público |
| `/projects` | Lista todos os jogos | Público |
| `/game/:id` | Detalhes de um jogo | Público |
| `/submit` | Submeter novo projeto | Alunos |
| `/edit/:id` | Editar projeto + Devlogs | Admin/Autor |
| `/about` | Sobre o curso | Público |
| `/admin` | Login administrativo | Público |
| `/admin/dashboard` | Painel de controle | Admin |

---

## 📝 Devlogs

Os devlogs agora suportam:
- 📝 Texto com quebras de linha
- 🖼️ Imagens (URL)
- 🎞️ GIFs animados
- 🎬 Vídeos do YouTube (embed)
- 🔗 Links externos

> **Nota:** Devlogs só podem ser criados/editados na página de edição do projeto (`/edit/:id`)

---

## 📦 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub à Vercel
2. Adicione as variáveis de ambiente do `.env`
3. Deploy automático!

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🏗️ Estrutura do Projeto

```
├── components/          # Componentes reutilizáveis
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── LoadingScreen.tsx
├── context/
│   └── GameContext.tsx  # Estado global + integração Firebase
├── firebase/
│   ├── config.ts        # Configuração Firebase (apenas Firestore)
│   └── services.ts      # Funções CRUD
├── pages/               # Páginas da aplicação
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── GamePage.tsx
│   ├── SubmitProject.tsx
│   ├── AboutCourse.tsx
│   ├── AdminLogin.tsx
│   └── AdminDashboard.tsx
├── types.ts             # Tipos TypeScript
├── constants.ts         # Dados mockados/demonstração
└── firestore.rules      # Regras de segurança
```

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **React 19** | Framework UI |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool |
| **React Router** | Navegação (HashRouter) |
| **Firebase Firestore** | Banco de dados |
| **Tailwind CSS** | Estilização |
| **Lucide React** | Ícones |

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 📋 Checklist Pós-Deploy

- [ ] Configurar variáveis de ambiente no servidor
- [ ] Atualizar regras do Firestore
- [ ] Fazer login como admin e clicar em "Seed Database" (se necessário)
- [ ] Cadastrar alunos reais
- [ ] Remover dados de demonstração

---

## 📝 Licença

MIT © SENAI Vitória
