FROM node:alpine

WORKDIR /app

COPY package.json /app/

COPY  . /app

#RUN rm package-lock.json

RUN npm install

# COPY . /app/

CMD ["npm","start"]

