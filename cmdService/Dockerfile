FROM node:22

WORKDIR /usr/src/app

COPY package* .

RUN npm i

COPY . .

RUN npm i -g typescript


RUN npm run build

EXPOSE 9000

CMD [ "npm","run","start" ]