FROM node:8.7

WORKDIR /usr/src/app
COPY ./api_server .

RUN "yarn"

EXPOSE 3090
