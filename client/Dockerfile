FROM node:20-alpine

WORKDIR /app

ARG DOCKER_BUILD=1
ENV DOCKER_BUILD=1

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
