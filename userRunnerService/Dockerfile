FROM node:20

WORKDIR /usr/src/app

COPY package* .

RUN npm i

COPY . .

RUN npm i -g typescript

RUN npm run build

EXPOSE 4000

CMD [ "npm","run","start" ]