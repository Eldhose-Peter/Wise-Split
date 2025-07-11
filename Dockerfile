# Use official Node.js LTS image for build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .

# Use a smaller image for production
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "start"]
