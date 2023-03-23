FROM node:18-bullseye-slim AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-bullseye-slim
WORKDIR /app
COPY --from=builder /app/.output /app
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000 
ENTRYPOINT ["node", "./server/index.mjs"]
