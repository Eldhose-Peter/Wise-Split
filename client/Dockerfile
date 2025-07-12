# Build static Next.js site
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve static files with NGINX
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/out .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
