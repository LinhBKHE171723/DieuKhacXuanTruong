FROM node:22-bookworm-slim AS builder

WORKDIR /app

ARG VITE_API_BASE_URL=/api
ARG VITE_SITE_URL=

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
