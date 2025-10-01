QuizEdu – Hackathon FIAP

1. Descrição

QuizEdu é uma plataforma educacional desenvolvida para facilitar a criação e gestão de quizzes para professores e estudantes. O objetivo é tornar o processo de avaliação mais interativo e prático, permitindo acompanhamento em tempo real do desempenho dos alunos.

2. Funcionalidades

Criação de quizzes e perguntas.

Gestão de turmas e alunos.

Visualização de resultados e desempenho dos alunos.

Interface web responsiva.

3. Tecnologias

Frontend: Vue.js, TypeScript, HTML, CSS

Backend: Node.js, TypeScript, Express

Banco de Dados: (informar se houver, ex.: PostgreSQL ou MongoDB)

Docker: Orquestração via docker-compose.yml

4. Como Rodar

# Clonar repositório

`git clone https://github.com/jadsow/hackaton-fiap.git`

# Backend

cd quizedu-backend
npm install
npm run dev

# Frontend

`cd quizedu-frontend`
`npm install`
`npm run serve`

# Com Docker

`docker-compose up --build`

# Funcionamento da Plataforma

Para acessar a plataforma, primeiramente entre com o login de admin com as seguintes credenciais:
admin@admin.com
admin123

Após logar como admin, você poderá criar uma usuário de professor, com este, você poderá logar e criar os quizzes.

Para acessar os quizzes cadastrados basta acessar a rota /quizzes e realizar as respostas.
