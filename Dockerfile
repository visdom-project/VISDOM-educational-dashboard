FROM node:14
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app

ARG REACT_APP_ELASTICSEARCH_HOST
ARG REACT_APP_CONFIG_HOST
ARG REACT_APP_ADAPTER_HOST
ARG REACT_APP_COURSE_ID
ARG REACT_APP_TOKEN
ARG REACT_APP_MQTT_HOST

COPY package*.json /app/
RUN npm clean-install
# hack to avoid autoprefixer warning about deprecated color-adjust
RUN for filename in $(find . -type f -print0 | xargs -0 grep -l ";color-adjust:" | grep bootstrap); do sed -i 's/;color-adjust/;print-color-adjust/g' $filename; done

COPY ./ /app/
RUN npm run build

ENTRYPOINT ["npx", "serve", "-s", "build"]
