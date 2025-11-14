# Etapa 1: Build de Angular SSR
FROM node:20.9.0-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Instala Angular CLI y dependencias
#RUN npm install -g @angular/cli@17
RUN npm install

COPY . .
# Compila cliente y servidor SSR
RUN npm run build:ssr

# Etapa 2: Ejecutar SSR con Node
FROM node:20.9.0-alpine

WORKDIR /app

# Copia solo lo necesario
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

# Instala dependencias de producción
RUN npm install --omit=dev

EXPOSE 4200

# Ejecuta el servidor SSR
CMD ["node", "dist/frontend/server/main.js"]
