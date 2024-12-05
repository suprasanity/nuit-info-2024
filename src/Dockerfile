# Use the official Node.js 14 image as the base image
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --force

# Copy the entire Angular application to the container
COPY ../node_modules .

# Build the Angular application
RUN npm run build --production

# Stage 2: Create a production-ready image with Nginx
FROM nginx:1.21

# Copy built Angular application to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
