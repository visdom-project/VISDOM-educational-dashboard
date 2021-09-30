FROM node:latest AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm build

FROM nginx:alpine
COPY --from=builder ./build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]


