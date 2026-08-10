# Build stage
FROM node:24.19.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
# Use nginx-unprivileged with a non-root user for security
FROM nginxinc/nginx-unprivileged:latest
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build /app/dist/*/browser /usr/share/nginx/html/

USER nginx
EXPOSE 80