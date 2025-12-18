# Production Dockerfile (Full Stack with Backend Proxy)
# Build locally first: npm run build
FROM nginx:alpine

COPY dist /usr/share/nginx/html
COPY devops/nginx.conf /etc/nginx/nginx.conf
COPY devops/app.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
