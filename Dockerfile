# Use official Node.js LTS image for build
FROM node:lts-alpine3.17 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .

RUN npx prisma generate
RUN npm run build

# Use a smaller image for production
FROM node:lts-alpine3.17 AS production

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "start"]
