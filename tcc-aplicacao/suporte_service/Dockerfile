FROM node:18-slim

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install --production

# Copia o código
COPY . .

EXPOSE 8002

CMD ["node", "index.js"]
