# Frontend Docker Build Guide

## Prerequisites

### For Development (Dockerfile.dev)
**No build needed!** Just have your source code ready.

### For Production (Dockerfile / Dockerfile.prod)
Build the frontend first:
```bash
npm run build
```

## Build Options

### 1. Development (with Hot Reload) ⚡
Uses Vite dev server with hot module replacement - **no build required!**

```bash
docker build -f Dockerfile.dev -t frontend:dev .
```

**Run:**
```bash
docker run -p 5173:5173 -v $(pwd):/app frontend:dev
```

Access at: `http://localhost:5173`

**Features:**
- ✅ Hot reload on code changes
- ✅ Fast refresh
- ✅ No build step needed
- ✅ Full development experience

### 2. Production Preview (Default Dockerfile)
Uses nginx to serve pre-built files - **requires `npm run build` first!**

```bash
# Build first
npm run build

# Then build Docker image
docker build -t frontend:preview .
```

**Run:**
```bash
docker run -p 80:80 frontend:preview
```

Access at: `http://localhost`

### 3. Production (Full Stack)
Uses complete nginx config with backend proxy, CORS, caching, etc.

```bash
# Build first
npm run build

# Build with production Dockerfile
docker build -f Dockerfile.prod -t frontend:prod .
```

**Run with docker-compose:**
```bash
docker-compose up
```

## Configuration Files

| File | Purpose | Requires Build? |
|------|---------|----------------|
| `Dockerfile.dev` | Development with hot reload | ❌ No |
| `Dockerfile` | Production preview (standalone) | ✅ Yes |
| `Dockerfile.prod` | Production with backend proxy | ✅ Yes |
| `nginx.conf` | Simple nginx config | - |
| `../devops/nginx.conf` | Main nginx config | - |
| `../devops/app.conf` | Full server block with proxy | - |

## Docker Compose

### Development Mode
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile.dev
  ports:
    - "5173:5173"
  volumes:
    - ./frontend:/app
    - /app/node_modules
```

### Production Mode
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile.prod
  ports:
    - "80:80"
```

## Quick Reference

```bash
# Development (hot reload, no build)
docker build -f Dockerfile.dev -t frontend:dev .
docker run -p 5173:5173 -v $(pwd):/app frontend:dev

# Production preview (build required)
npm run build
docker build -t frontend:preview .
docker run -p 80:80 frontend:preview

# Production full stack (build required)
npm run build
docker build -f Dockerfile.prod -t frontend:prod .
```
