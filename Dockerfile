# Step 1: Build stage
FROM node:18-alpine as build
#new file
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve the build using Nginx
FROM nginx:alpine

COPY --from=build /app/dist/angular-auth-app/browser /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
