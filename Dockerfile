# Use official Node.js LTS image for build
FROM node:18-alpine AS builder

RUN apt-get update -y \
&& apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .

RUN npx prisma generate
RUN npm run build

# Use a smaller image for production
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "start"]
