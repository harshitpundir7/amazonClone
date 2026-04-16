FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files and lock file
COPY package*.json ./

# Install dependencies (use npm install for safety if lock file is outdated)
RUN npm install --production=false

# Copy prisma schema first (needed for generate)
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port Railway provides via env
EXPOSE 5000

# Start: run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
