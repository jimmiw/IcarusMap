# backend/Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build  # assumes you compile TS → JS into /dist

EXPOSE 3001
CMD ["node", "dist/index.js"]
