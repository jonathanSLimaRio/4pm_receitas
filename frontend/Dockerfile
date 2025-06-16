FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

ENV ROLLUP_USE_NODE_BUILTINS=true

RUN yarn install && rm -rf node_modules/rollup/dist/native.js

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]
