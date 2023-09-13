ARG BUN_VERSION=1.0.1
FROM oven/bun:${BUN_VERSION} as base

LABEL fly_launch_runtime="Bun"

WORKDIR /app
ENV NODE_ENV=production

FROM base as build

RUN apt-get update -qq && \
  apt-get install -y python-is-python3 pkg-config build-essential 

COPY --link bun.lockb package.json ./
RUN bun install --ci

COPY --link . .

RUN bun run build

FROM base

COPY --from=build /app /app

EXPOSE 3000
CMD [ "bun", "src/index.ts" ]
