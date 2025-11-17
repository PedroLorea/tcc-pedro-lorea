FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# copia o resto do projeto
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
