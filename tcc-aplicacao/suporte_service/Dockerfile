FROM node:18-slim

WORKDIR /app

# Copia package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala dependências
RUN npm install --production

# Copia o restante do código
COPY . .

EXPOSE 8002

CMD ["node", "index.js"]
