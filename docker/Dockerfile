# build enironment
FROM node:9.10.0 as builder

ARG mobile_env=./docker/.env
ARG desktop_env=./docker/.env.desktop

# set working directory
WORKDIR /srv/src
ENV PATH /srv/src/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /srv/src/package.json
COPY lerna.json /srv/src/lerna.json
COPY yarn.lock /srv/src/yarn.lock
# install and cache packages dependencies
COPY packages/core-web/package.json /srv/src/packages/core-web/package.json
COPY packages/core-models/package.json /srv/src/packages/core-models/package.json
COPY packages/core-redux/package.json /srv/src/packages/core-redux/package.json
COPY web/yesplz-mobile/package.json /srv/src/web/yesplz-mobile/package.json
COPY web/yesplz-desktop/package.json /srv/src/web/yesplz-desktop/package.json

# install yarn, change permission
RUN npm install -g yarn
RUN npm install -global lerna
RUN chmod a+rwx  /usr/local/lib/node_modules/yarn/bin/yarn*
RUN chmod a+rwx  /usr/local/bin/yarn*

# install package to enable caching
RUN yarn reset

# copy project file
COPY . /srv/src

# use react .env for production
COPY $mobile_env /srv/src/web/yesplz-mobile/.env
COPY $desktop_env /srv/src/web/yesplz-desktop/.env

# build mobile script
ARG PUBLIC_URL=/mobile/public
RUN cd ./web/yesplz-mobile && yarn build

# build desktop script
ARG PUBLIC_URL=/desktop/public
RUN cd ./web/yesplz-desktop && yarn build

# production environment
# serve static files with nginx
FROM nginx:latest

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /srv/src/web/yesplz-mobile/build /srv/www/mobile
COPY --from=builder /srv/src/web/yesplz-desktop/build /srv/www/desktop

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
