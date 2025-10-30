FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json vite.config.ts ./

RUN npm install -g pnpm && corepack enable
RUN pnpm install

COPY . .

RUN pnpm build

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/.output ./output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g pnpm && corepack enable
RUN pnpm install --production

EXPOSE 3000

CMD ["node", "./output/server/index.mjs"]