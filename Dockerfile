FROM node:16.15.1-slim AS builder
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app

ARG REACT_APP_ELASTICSEARCH_HOST
ARG REACT_APP_CONFIG_HOST
ARG REACT_APP_ADAPTER_HOST
ARG REACT_APP_COURSE_ID
ARG REACT_APP_TOKEN
ARG REACT_APP_MQTT_HOST

COPY package*.json /app/
RUN npm clean-install  --legacy-peer-deps

COPY public/ ./public/
COPY src/ ./src/

RUN npm run-script build


FROM node:16.15.1-slim
COPY --from=builder /app/build /node-build

ENTRYPOINT [ "npx", "serve", "-s", "/node-build" ]
