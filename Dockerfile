# Build the node application using this builder step
FROM node:14.17.6 AS builder

ARG ELASTICSEARCH_HOST
ARG CONFIG_HOST
ARG ADAPTER_HOST
ARG ADAPTER_TOKEN
ARG COURSE_ID

COPY package.json /package.json
COPY package-lock.json /package-lock.json
COPY public/ /public/
COPY src/ /src/

ENV REACT_APP_ELASTICSEARCH_HOST ${ELASTICSEARCH_HOST}
ENV REACT_APP_CONFIG_HOST ${CONFIG_HOST}
ENV REACT_APP_ADAPTER_HOST ${ADAPTER_HOST}
ENV REACT_APP_TOKEN ${ADAPTER_TOKEN}
ENV REACT_APP_COURSE_ID ${COURSE_ID}

RUN npm clean-install
RUN npm run build


# Deploy Nginx server
FROM nginx:1.21.3-alpine
# copy the NodeJS files from the build step
COPY --from=builder /build/ /var/www/

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
