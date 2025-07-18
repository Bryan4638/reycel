FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app/

# 1. Copiar solo los archivos necesarios para instalar dependencias
COPY package.json ./
COPY prisma ./prisma

# 2. Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm install

# 3. Copiar el resto de los archivos
COPY . .

<<<<<<< HEAD
=======
# 4. Ejecutar comandos de construcción
#RUN npm run init
#RUN npx prisma db seed

>>>>>>> 2d2c16c28853a6459eb457df19cb20c0158f60ad
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
