FitPro — Documentação técnica atual
Versão do projeto: MVP / fase inicial
 Data do estado atual: 13/09/2026
 Stack: React + Vite + Node.js + Express + Prisma + SQLite

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


1. Objetivo do FitPro
O FitPro é um SaaS voltado para Personal Trainers, funcionando inicialmente como uma plataforma de gestão de alunos e treinos.
A visão do produto é evoluir para algo semelhante a:
CRM + plataforma de treinamento + perfil profissional + marketplace de Personal Trainers
Funcionalidades planejadas
Gestão de Personal Trainers
Gestão de alunos
Criação e gerenciamento de treinos
Biblioteca de exercícios
Acompanhamento de evolução
Agenda
Comunicação entre Personal e aluno
Pagamentos
Perfil público do Personal
Marketplace
Aplicativo/experiência para alunos
IA para auxiliar criação e progressão de treinos
Futuramente white-label
A estratégia inicial é não começar pelo marketplace. Primeiro o FitPro deve entregar valor real para o Personal na gestão dos alunos e treinos.


2. Arquitetura
Atualmente o projeto está dividido em:
fitpro/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── middleware/
    │   ├── utils/
    │   └── server.js
    │
    ├── prisma/
    │   └── schema.prisma
    │
    ├── prisma7.config.ts
    ├── .env
    ├── dev.db
    └── package.json

A arquitetura escolhida é:
React
   ↓
Axios
   ↓
REST API
   ↓
Express
   ↓
Middleware JWT
   ↓
Controllers
   ↓
Prisma
   ↓
SQLite


3. Frontend
Tecnologias
React
Vite
React Router
Axios
Instalação realizada:
npm create vite@latest frontend -- --template react
npm install
npm install react-router-dom axios


4. Backend
Tecnologias
Node.js
Express
CORS
dotenv
bcrypt
jsonwebtoken
Prisma 7.10.0
SQLite
better-sqlite3
Instalação:
npm install express cors dotenv bcrypt jsonwebtoken
npm install -D nodemon
npm install prisma @prisma/client
Prisma foi fixado em:
prisma@7.10.0
@prisma/client@7.10.0
Além disso:
npm install @prisma/adapter-better-sqlite3
npm install better-sqlite3


5. Banco de dados
O banco atual é SQLite:
DATABASE_URL="file:./dev.db"
E o JWT utiliza:
JWT_SECRET="fitpro-dev-secret-2026"
Em produção, o JWT_SECRET deverá obviamente ser substituído por um segredo forte e armazenado de forma segura.


6. Modelo de dados
Atualmente existem cinco entidades principais.
User
Representa a conta de acesso.
User
├── id
├── name
├── email
├── password
├── role
├── createdAt
└── updatedAt
Roles:
PERSONAL
ALUNO

Trainer
Perfil profissional do Personal.
Trainer
├── id
├── userId
├── bio
├── specialty
├── city
├── phone
├── instagram
├── price
├── createdAt
└── updatedAt
Relações:
User 1 ─── 1 Trainer
Trainer 1 ─── N Student
Trainer 1 ─── N Workout

Student
Representa o aluno vinculado a um Personal.
Student
├── id
├── userId
├── trainerId
├── birthDate
├── height
├── weight
├── goal
├── createdAt
└── updatedAt

Workout
Representa um treino.
Workout
├── id
├── name
├── description
├── trainerId
├── studentId
├── createdAt
└── updatedAt
Relação:
Student 1 ─── N Workout
Trainer 1 ─── N Workout
Workout 1 ─── N WorkoutExercise

WorkoutExercise
Representa cada exercício dentro de um treino.
WorkoutExercise
├── id
├── workoutId
├── exerciseName
├── sets
├── reps
├── weight
├── restSeconds
├── order
├── notes
├── createdAt
└── updatedAt
Isso permite representar, por exemplo:
Treino A — Peito/Tríceps

1. Supino reto
   4 séries
   10 repetições
   70 kg
   90s descanso

2. Supino inclinado
   3 séries
   12 repetições
   50 kg
   60s descanso


7. Autenticação
A autenticação já está funcional.
Fluxo:
Login
  ↓
POST /api/auth/login
  ↓
Validação email/senha
  ↓
bcrypt
  ↓
JWT
  ↓
Frontend salva token
  ↓
localStorage
  ↓
Axios envia Bearer Token
  ↓
authMiddleware
  ↓
req.user
O JWT contém:
{
  "userId": 1,
  "role": "PERSONAL"
}


8. Middleware JWT
Arquivo:
backend/src/middleware/authMiddleware.js
Responsabilidade:
Ler Authorization
Validar formato Bearer TOKEN
Validar JWT
Extrair userId
Colocar os dados em:
req.user
Exemplo:
req.user = {
  userId: 1,
  role: "PERSONAL"
}


9. API de autenticação
Implementado:
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
Foi criado um usuário Personal para testes:
Nome: João Silva
Email: joao@fitpro.com
Senha: 123456
Role: PERSONAL


10. API de Personal
Implementado:
GET /api/trainer/me
GET /api/trainer/dashboard
O Dashboard retorna:
{
  "success": true,
  "dashboard": {
    "statistics": {
      "totalStudents": 2,
      "totalWorkouts": 0,
      "activeStudents": 2
    },
    "recentStudents": [],
    "recentWorkouts": []
  }
}
Os dados atuais possuem 2 alunos.


11. API de alunos
Implementado:
POST   /api/students
GET    /api/students
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id
Testes realizados:
criação
listagem
busca individual
atualização
exclusão
validação de email duplicado
proteção por Personal autenticado
Atualmente existem dois alunos de teste mantidos no banco.


12. API de treinos
Implementado:
POST   /api/workouts
GET    /api/workouts
GET    /api/workouts/:id
PUT    /api/workouts/:id
DELETE /api/workouts/:id
Também foi implementada a relação:
Workout
   ↓
WorkoutExercise[]
Foi testado:
criação de treino
criação dos exercícios
listagem
busca individual
atualização
substituição dos exercícios
exclusão
tentativa de acessar treino inexistente
O teste foi removido posteriormente.
Estado atual:
Alunos: 2
Treinos: 0


13. Frontend — Login
Página:
/frontend/src/pages/Login.jsx
Fluxo:
Usuário informa email/senha
          ↓
POST /api/auth/login
          ↓
Recebe JWT
          ↓
localStorage.setItem("token", token)
          ↓
navigate("/dashboard")


14. Frontend — Dashboard
Página:
/frontend/src/pages/Dashboard.jsx
Fluxo:
Dashboard
    ↓
localStorage.getItem("token")
    ↓
getTrainerDashboard(token)
    ↓
GET /api/trainer/dashboard
    ↓
backend
    ↓
dados
    ↓
Dashboard
Atualmente mostra:
Dashboard

Alunos
2

Treinos
0

Alunos ativos
2
Ainda é apenas uma estrutura funcional, sem o design definitivo.


15. Axios
Arquivo:
frontend/src/services/api.js
Base URL:
http://localhost:3000/api
Durante o diagnóstico do JWT, foram adicionados logs temporários.
Foi descoberto o seguinte problema:
Authorization: "Bearer ${token}"
Isso enviava literalmente:
Bearer ${token}
em vez do JWT.
Corrigimos para:
Authorization: `Bearer ${token}`
Depois disso o JWT passou a chegar corretamente.


16. Problema de autenticação resolvido
O erro original era:
JsonWebTokenError: jwt malformed
O backend recebia:
Bearer ${token}
Após a correção:
Bearer eyJhbGciOiJIUzI1Ni...
O Axios passou a registrar:
AXIOS → GET http://localhost:3000/api/trainer/dashboard
AXIOS Authorization → Bearer eyJ...
E finalmente o Dashboard carregou.
Conclusão
A cadeia completa está funcionando:
React
 ↓
Axios
 ↓
JWT
 ↓
Express
 ↓
authMiddleware
 ↓
Prisma
 ↓
SQLite
 ↓
Dashboard


17. Situação atual

Backend
Módulo              Estado
Express             ✅
CORS                ✅
Prisma              ✅
SQLite              ✅
JWT                 ✅
bcrypt              ✅
Login               ✅
Registro            ✅
/me                 ✅
Trainer             ✅
Dashboard API       ✅
Students CRUD       ✅
Workout CRUD        ✅
WorkoutExercise     ✅

Frontend
Módulo              Estado
Vite                ✅
React               ✅
React Router        ✅
Axios               ✅
Login               ✅
JWT localStorage    ✅
Dashboard API       ✅
Dashboard visual    🚧
Layout              🚧
Alunos              🚧
Treinos             🚧
Exercícios          🚧



