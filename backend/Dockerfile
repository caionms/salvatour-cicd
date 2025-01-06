# Use uma imagem base oficial do Node.js
FROM node:18-alpine

# Atualize o npm para a última versão estável
RUN npm install -g npm@8.19.4

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código do backend para dentro do container
COPY . .

# Exponha a porta do backend
EXPOSE 3000

# Comando para iniciar o backend
CMD ["npm", "run", "start"]