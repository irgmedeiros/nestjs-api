FROM node:16.3.0-alpine

WORKDIR /home/app

ADD package.json /home/app
RUN npm install
ADD . /home/app
RUN npm run build

CMD ["npm", "start:prod"]

EXPOSE 3000
