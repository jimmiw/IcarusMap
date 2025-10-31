# frontend/Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve with a lightweight HTTP server
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist"]
