FROM node:14 AS builder
COPY package.json ./
RUN npm install
COPY . .

ENTRYPOINT ["npm", "start"]


