FROM node:20 AS builder
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci --omit=dev

COPY frontend .

RUN npm run build

FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

