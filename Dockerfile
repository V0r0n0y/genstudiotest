# Multi-stage Docker build for Roman Numeral Converter
# Stage 1: Build the React application
FROM node:18-alpine as build
WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client ./client
RUN cd client && npm run build

# Stage 2: Build the server
FROM node:18-alpine
WORKDIR /app
COPY server ./server
COPY --from=build /app/client/build ./client/build
COPY package*.json ./
RUN npm install
EXPOSE 8080
CMD ["node", "server/index.js"] 