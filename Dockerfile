FROM node:14.15.1-alpine

WORKDIR /app

ADD client.tar /app

RUN ls

RUN yarn config set registry https://registry.npm.taobao.org

RUN yarn install --prod

ENTRYPOINT [ "yarn", "start:prod" ]
