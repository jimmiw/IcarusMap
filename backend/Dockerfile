# backend/Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build  # assumes you compile TS → JS into /dist

EXPOSE 4000
CMD ["node", "dist/server.js"]
