FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package.json ./
COPY tsconfig.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Imagen de producción
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar solo dependencias de producción
RUN npm install --production

# Copiar código compilado desde builder
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "dist/server.js"]
