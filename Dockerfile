FROM node:16-alpine3.14
LABEL version="1.0.0"

# RUN npm install -g yarn

WORKDIR /usr/src/app

# COPY repository
COPY package*.json ./
RUN yarn

COPY . .
RUN yarn build

EXPOSE 3000
# Start
ENTRYPOINT [ "yarn", "start:prod" ]