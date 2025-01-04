# Use uma imagem base oficial do Node.js
FROM node:16

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código do frontend para dentro do container
COPY . .

# Execute o build do frontend
RUN npm run build

# Use o servidor HTTP para servir os arquivos do build
RUN npm install -g serve

# Exponha a porta do frontend
EXPOSE 5000

# Comando para iniciar o servidor de arquivos estáticos
CMD ["serve", "-s", "dist", "-l", "5000"]