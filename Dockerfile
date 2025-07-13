# Use official Node.js LTS image for build
FROM node:lts-alpine3.17 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .

RUN npm run prisma:deploy
RUN npm run build

# Use a smaller image for production
FROM node:lts-alpine3.17 AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
