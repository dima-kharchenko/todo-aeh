FROM node:20-alpine as builder

WORKDIR /app
COPY . .

RUN npm install && npm run build

FROM alpine:3.18

RUN mkdir -p /frontend_build

COPY --from=builder /app/dist /frontend_build
VOLUME ["/frontend_build"]

