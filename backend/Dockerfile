# ============================================
# Production Stage (Build locally first!)
# ============================================
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ONLY production dependencies
# Use virtual package to install build deps temporarily, then remove them
RUN apk add --no-cache --virtual .build-deps python3 make g++ && \
    npm install --production --legacy-peer-deps && \
    npm cache clean --force && \
    apk del .build-deps

# Copy pre-built application files
COPY dist ./dist
COPY config ./config
COPY database ./database
COPY src ./src
COPY public ./public
COPY favicon.png ./favicon.png

# Copy TypeScript config (needed at runtime for Strapi)
COPY tsconfig.json ./tsconfig.json
COPY types ./types

# Create necessary directories
RUN mkdir -p .tmp

# Set environment to production
ENV NODE_ENV=production

# Expose Strapi port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD node -e "require('http').get('http://localhost:1337/_health', (r) => {process.exit(r.statusCode === 204 ? 0 : 1)})"

# Start Strapi
CMD ["npm", "run", "start"]
