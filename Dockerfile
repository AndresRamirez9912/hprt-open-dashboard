# PhotoPrint: built with Bun, served by nginx, which also proxies /api to the bridge.
#   docker build -t photoprint .
#   docker run -p 8080:80 -e BRIDGE_URL=http://host.docker.internal:8787 --add-host host.docker.internal:host-gateway photoprint

FROM oven/bun:1.3.14-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.29-alpine
# The official image runs envsubst on /etc/nginx/templates/*.template at start-up;
# the filter keeps nginx's own $variables untouched.
ENV BRIDGE_URL=http://host.docker.internal:8787 \
    NGINX_ENVSUBST_FILTER=^BRIDGE_URL$
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
