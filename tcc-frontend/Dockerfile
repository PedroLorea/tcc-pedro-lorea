FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ rust cargo

COPY package*.json ./
RUN npm install

COPY . .

ENV TURBOPACK_DISABLE_OVERLAY=1

EXPOSE 3000

CMD ["npm", "run", "dev"]
