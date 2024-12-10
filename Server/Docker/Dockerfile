FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm install -g nodemon
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

ENV NAME server

CMD ["npm", "start"]