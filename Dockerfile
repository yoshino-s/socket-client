FROM node:14.15.1-alpine as build

WORKDIR /app

COPY . /app

RUN yarn config set registry https://registry.npm.taobao.org

RUN yarn && yarn build

RUN cd /app/front && yarn && yarn build

FROM node:14.15.1-alpine as runtime

WORKDIR /app

COPY --from=build /app/front/dist /app/static
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json  /app/

RUN yarn config set registry https://registry.npm.taobao.org

RUN yarn install --prod

ENTRYPOINT [ "yarn", "start:prod" ]
