FROM node:24-alpine

WORKDIR /app

# Source is bind-mounted and node_modules is a named volume (see docker-compose.yml),
# so nothing is copied or installed at build time. The compose command installs deps.
EXPOSE 3000

CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]
