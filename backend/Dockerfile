FROM node:18

WORKDIR /app

COPY code .

RUN npm install && npm run build

CMD npm run start:prod