MyTasks XP - Gerenciador de Tarefas Gamificado

Um sistema de lista de tarefas (To-Do List) desenvolvido com Django (Backend) e React (Frontend). O projeto inclui sistema de autenticação JWT, níveis de XP e interface responsiva.
-O sistema de JWT (JSON Web Token) é um padrão da indústria (RFC 7519) utilizado para compartilhar informações de forma segura entre um cliente (frontend React) e um servidor (backend Django) como um objeto JSON. No projeto, ele funciona como um "crachá digital" que prova quem você é em cada ação realizada.

Funcionalidades
- Gamificação: Ganhe +20 XP ao concluir tarefas e suba de nível.
- Perfil: Edição de nome de exibição e progresso salvo localmente.
- CRUD Completo: Criação (com descrição), leitura, edição e exclusão de tarefas.
- Segurança: Proteção de rotas via Token JWT.

Como rodar o projeto

1. Backend (Django)
Certifique-se de ter o Python instalado.
1. Acesse a pasta do backend: `cd backend`
2. Crie um ambiente virtual: `python -m venv venv`
3. Ative o venv:
   - Windows: `.\venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Instale as dependências: `pip -r requirements.txt`
5. Rode as migrações: `python manage.py migrate`
6. Inicie o servidor: `python manage.py runserver`

2. Frontend (React)
Certifique-se de ter o Node.js instalado.
1. Acesse a pasta do frontend: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie o projeto: `npm run dev`

Autenticação
Para utilizar o sistema, é necessário criar um usuário via Django Admin ou pela rota de registro. Sem o login, a API retornará **Erro 401 (Unauthorized)** e os botões não funcionarão.
