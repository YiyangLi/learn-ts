FROM node:18-alpine as ts-compiler
WORKDIR /usr/app
COPY . ./
RUN npm install
RUN npm link
CMD ["simple", "start"]
