########## Stage 1: build the web assets ##########
FROM node:20-alpine AS web-builder
ARG APP_EFFECTIVE_VERSION
WORKDIR /app/web

COPY web/package*.json ./
RUN npm ci --ignore-scripts

COPY web/ ./
ENV VITE_APP_VERSION=${APP_EFFECTIVE_VERSION}
RUN npm run build

########## Stage 2: compile the Rust binary ##########
FROM rust:1.91 AS builder
ARG APP_EFFECTIVE_VERSION
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends pkg-config libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock ./
RUN cargo fetch

COPY src ./src
ENV APP_EFFECTIVE_VERSION=${APP_EFFECTIVE_VERSION}
RUN cargo build --release --locked

########## Stage 3: create a slim runtime image ##########
FROM debian:bookworm-slim AS runtime
ARG APP_EFFECTIVE_VERSION

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app

COPY --from=builder /app/target/release/tavily-hikari /usr/local/bin/tavily-hikari
COPY --from=web-builder /app/web/dist /srv/app/web

ENV PROXY_DB_PATH=/srv/app/data/tavily_proxy.db \
    PROXY_BIND=0.0.0.0 \
    PROXY_PORT=8787 \
    WEB_STATIC_DIR=/srv/app/web \
    APP_EFFECTIVE_VERSION=${APP_EFFECTIVE_VERSION}

LABEL org.opencontainers.image.version=${APP_EFFECTIVE_VERSION}

VOLUME ["/srv/app/data"]
EXPOSE 8787

ENTRYPOINT ["tavily-hikari"]
CMD []
