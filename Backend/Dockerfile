FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app/

# 1. Copiar solo los archivos necesarios para instalar dependencias
COPY Backend/package.json ./
COPY Backend/prisma ./prisma

# 2. Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm install

# 3. Copiar el resto de los archivos
COPY Backend .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
