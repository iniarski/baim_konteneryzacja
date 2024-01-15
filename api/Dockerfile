# parent image
FROM node:21-alpine

WORKDIR /api

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]