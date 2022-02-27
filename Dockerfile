FROM node:17.6-buster

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

CMD npm start
