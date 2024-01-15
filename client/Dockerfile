FROM node:21-alpine

RUN adduser -D -u 1001 baim

USER baim

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]