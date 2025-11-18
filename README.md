A aplicação é dividida em dois projetos principais e um arquivo de orquestração:

📁 Estrutura do Repositório
tcc-frontend – Interface web da plataforma
tcc-aplicacao – Microsserviços e lógica da aplicação
docker-compose.yml – Responsável por subir toda a infraestrutura necessária, frontend e microsserviços da aplicação

O arquivo docker-compose.yml é responsável por iniciar automaticamente todos os serviços, incluindo banco de dados, mensageria (se utilizada) e os microsserviços da aplicação.

▶️ Pré-requisitos
Para executar o projeto, é necessário ter instalado:
Docker

⚙️ Envs
Para questões de praticidade, optou-se por deixar os arquivos .env diretamente no repositório, facilitando a execução da plataforma durante a avaliação.

🚀 Executando Toda a Plataforma
Para iniciar todos os microsserviços, basta usar:
docker compose up --build

O Docker cuidará de:
Subir o banco de dados
Iniciar os microsserviços
Iniciar o frontend
Integrar todos os componentes automaticamente

Após o carregamento:
Acesse o frontend em: http://localhost:3000
Os serviços backend estarão rodando nas portas definidas no docker-compose.yml
