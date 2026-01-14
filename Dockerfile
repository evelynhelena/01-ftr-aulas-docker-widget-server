# Define a imagem base usando Node.js versão 22.21.1 e dá o nome de "base" a esse estágio
FROM node:22.21.1 AS base

# Instala o gerenciador de pacotes pnpm globalmente dentro do container
RUN npm i -g pnpm

# Cria um novo estágio chamado "dependecies" baseado na imagem "base"
FROM base AS dependecies

# Define o diretório de trabalho padrão dentro do container
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependências para aproveitar o cache do Docker
COPY package.json pnpm-lock.yaml ./

# Instala todas as dependências do projeto usando pnpm
RUN pnpm install

# Cria um novo estágio chamado "build" baseado na imagem "base"
FROM base AS build

# Define o diretório de trabalho para o estágio de build
WORKDIR /usr/src/app

# Copia todo o código-fonte do projeto para dentro do container
COPY . .

# Copia as dependências já instaladas do estágio "dependecies"
COPY --from=dependecies /usr/src/app/node_modules ./node_modules

# Executa o script "build" definido no package.json (gera a pasta dist / build)
RUN pnpm build

# Remove dependências de desenvolvimento e deixa apenas as de produção
RUN pnpm prune --prod

# Cria o estágio final de produção usando uma imagem Alpine bem menor
FROM cgr.dev/chainguard/node AS deploy


USER 1000

# Define o diretório de trabalho do container de produção
WORKDIR /usr/src/app

# Copia apenas os arquivos de build para o container final
COPY --from=build /usr/src/app/dist ./dist

# Copia somente as dependências de produção para o container final
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copia o package.json para o container final
COPY --from=build /usr/src/app/package.json ./package.json

#cria as variaveis de ambiente (apenas para ambiente de teste, pois essa não é a forma correta)
# ENV CLOUDFLARE_ACCESS_KEY_ID=""
# ENV CLOUDFLARE_SECRET_ACCESS_KEY=""
# ENV CLOUDFLARE_BUCKET=""
# ENV CLOUDFLARE_ACCOUNT_ID=""
# ENV CLOUDFLARE_PUBLIC_URL=""

# Informa que a aplicação dentro do container utiliza a porta 3333
EXPOSE 3333

# Define o comando que será executado automaticamente quando o container iniciar
CMD ["dist/server.mjs"]
