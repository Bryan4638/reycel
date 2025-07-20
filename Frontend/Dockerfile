FROM node:20-alpine

WORKDIR /app/

# 1. Copiar solo los archivos necesarios para instalar dependencias
COPY Frontend/package.json Frontend/package-lock.json ./

# 2. Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm ci

# 3. Copiar el resto de los archivos
COPY Frontend .

# 4. Ejecutar comandos de construcción
RUN npm run build

EXPOSE 4174

CMD ["npm", "run", "preview"]
