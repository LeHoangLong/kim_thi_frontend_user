FROM lehoanglong/nodejs:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN git clone git@github.com:LeHoangLong/kim_thi_frontend_user.git && git submodule init && git submodule update && npm install

COPY . .

RUN npm run build

CMD npm start
