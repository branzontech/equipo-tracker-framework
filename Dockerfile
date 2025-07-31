# Etapa 1: build de Vite y dependencias
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build del frontend
RUN npm run build

# Etapa 2: producción
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Copia todo desde la etapa anterior
COPY --from=build /app /app

# Genera Prisma Client
RUN npx prisma generate

# Expone el puerto configurado en config.js (por defecto 3003)
EXPOSE 3003

# Usa ts-node para levantar el backend
CMD ["npm", "run", "start"]
