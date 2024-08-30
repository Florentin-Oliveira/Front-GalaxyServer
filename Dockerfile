# Usar uma imagem base de Node.js
FROM node:14-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante do código do projeto para o diretório de trabalho
COPY . .

# Construir o aplicativo para produção
RUN npm run build

# Expor a porta que o aplicativo irá rodar
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
