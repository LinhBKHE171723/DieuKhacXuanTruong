FROM node:22-bookworm-slim AS builder

WORKDIR /app

ARG VITE_ADMIN_API_BASE_URL=/api

ENV VITE_ADMIN_API_BASE_URL=$VITE_ADMIN_API_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
