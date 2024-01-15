# parent image
FROM node:21-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

RUN useradd -m -d /home/baim -s /bin/bash baim

USER baim


CMD ["npm", "start"]