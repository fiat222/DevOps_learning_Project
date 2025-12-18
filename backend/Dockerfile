# Stage 1: Build
FROM node:20-alpine AS build

# Install build dependencies for better-sqlite3 or other native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Use production env
ENV NODE_ENV=production

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ONLY production dependencies
# Add build deps temporarily if native modules need to be re-built during npm install
RUN apk add --no-cache python3 make g++ && \
    npm install --only=production --legacy-peer-deps && \
    apk del python3 make g++

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/config ./config
COPY --from=build /app/database ./database
COPY --from=build /app/src ./src
COPY --from=build /app/types ./types
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/favicon.png ./favicon.png

# Create necessary directories
RUN mkdir -p .tmp

EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
    CMD node -e "require('http').get('http://localhost:1337/_health', (r) => {process.exit(r.statusCode === 204 ? 0 : 1)})"

CMD ["npm", "run", "start"]
