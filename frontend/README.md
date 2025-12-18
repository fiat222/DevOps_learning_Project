# React + Strapi E-commerce Frontend

A modern e-commerce frontend built with React and Vite, designed to work with Strapi CMS backend.

## Features

- 🔐 **Authentication**: JWT-based login/logout with session persistence
- 🛒 **Shopping Cart**: Add/remove items, adjust quantities, persistent cart storage
- 📦 **Product Catalog**: Dynamic product listing from Strapi
- 🎨 **Modern UI**: Dark mode design with smooth animations
- 🐳 **Docker Ready**: Multi-stage Dockerfile with Nginx

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Strapi** - Headless CMS (backend)

## Prerequisites

- Node.js 18+ and npm
- Strapi backend running (see `STRAPI_SETUP.md`)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:1337
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Strapi Backend Setup

See **[STRAPI_SETUP.md](./STRAPI_SETUP.md)** for detailed instructions on:
- Creating Content-Types (Product, Order)
- Setting up permissions
- Adding sample data
- CORS configuration

## Docker Deployment

### Build Docker Image

```bash
docker build -t frontend-app .
```

### Run Container

```bash
docker run -p 8080:80 frontend-app
```

Access at `http://localhost:8080`

### Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    environment:
      - VITE_API_URL=http://your-strapi-url:1337
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── ProductList.jsx
│   │   └── Cart.jsx
│   ├── config/           # Configuration files
│   │   └── api.js        # Strapi API integration
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── Dockerfile            # Multi-stage Docker build
├── nginx.conf            # Nginx configuration
└── package.json
```

## API Integration

All Strapi API calls are centralized in `src/config/api.js`:

- `api.login(identifier, password)` - User authentication
- `api.getMe(token)` - Get current user
- `api.getProducts()` - Fetch all products
- `api.createOrder(token, orderData)` - Create new order

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Strapi backend URL | `http://localhost:1337` |

## DevOps Practice

This project is designed for DevOps practice with:

- ✅ **Docker** - Containerization with multi-stage builds
- ✅ **Nginx** - Production-ready web server
- ✅ **Environment Variables** - Configuration management
- ✅ **CI/CD Ready** - Easy integration with GitHub Actions, GitLab CI, etc.

## Troubleshooting

### CORS Errors

If you encounter CORS issues, ensure your Strapi backend has the correct CORS configuration in `config/middlewares.js`:

```javascript
{
  name: 'strapi::cors',
  config: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
}
```

### Images Not Loading

Make sure:
1. Images are uploaded in Strapi admin panel
2. `VITE_API_URL` is correctly set
3. Strapi's upload folder is accessible

### Login Not Working

1. Check that Strapi is running
2. Verify user exists in Strapi admin
3. Check browser console for errors
4. Ensure `users-permissions` plugin is enabled in Strapi

## License

MIT

## Author

Created for DevOps practice with Docker and Nginx.
