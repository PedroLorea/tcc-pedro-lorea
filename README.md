A aplicação é dividida em dois projetos principais e um arquivo de orquestração: <br>

📁 Estrutura do Repositório <br>
tcc-frontend – Interface web da plataforma <br>
tcc-aplicacao – Microsserviços e lógica da aplicação <br>
docker-compose.yml – Responsável por subir toda a infraestrutura necessária, frontend e microsserviços da aplicação <br>

O arquivo docker-compose.yml é responsável por iniciar automaticamente todos os serviços, incluindo banco de dados, mensageria (se utilizada) e os microsserviços da aplicação.

▶️ Pré-requisitos <br>
Para executar o projeto, é necessário ter instalado: <br>
Docker

⚙️ Envs <br>
Para questões de praticidade, optou-se por deixar os arquivos .env diretamente no repositório, facilitando a execução da plataforma durante a avaliação.

🚀 Executando Toda a Plataforma <br>
Para iniciar todos os microsserviços, basta usar: <br>
docker compose up --build

O Docker cuidará de: <br>
Subir o banco de dados <br>
Iniciar os microsserviços <br>
Iniciar o frontend <br>
Integrar todos os componentes automaticamente <br>

Após o carregamento: <br>
Acesse o frontend em: http://localhost:3000 <br>
Os serviços backend estarão rodando nas portas definidas no docker-compose.yml
