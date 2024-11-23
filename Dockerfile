# Use a imagem Node.js oficial
FROM node:18

# Cria o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código-fonte para o contêiner
COPY . .

# Exposição da porta para o Next.js
EXPOSE 3000

# Comando para rodar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
