# Usa imagem Node.js oficial
FROM node:20-alpine

# Cria diretório para o app
WORKDIR /app

# Copia arquivos
COPY ./app .

# Instala dependências
RUN npm install

# Expõe a porta usada pelo Express
EXPOSE 3000

# Comando para rodar o app
CMD ["npm", "start"]
