FROM node:14
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app

COPY package*.json /app/
RUN npm clean-install
# hack to avoid autoprefixer warning about deprecated color-adjust
RUN for filename in $(find . -type f -print0 | xargs -0 grep -l ";color-adjust:" | grep bootstrap); do sed -i 's/;color-adjust/;print-color-adjust/g' $filename; done

COPY ./ /app/
RUN npm run build

ENTRYPOINT ["npx", "serve", "-s", "build"]
