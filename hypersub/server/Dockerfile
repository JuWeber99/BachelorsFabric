FROM node:10.19.0-alpine

RUN mkdir -p /home/node/app/node_modules && mkdir /home/node/app/gateway/
COPY ../organizations/peerOrganizations/nexnet.hypersub.com/connection-nexnet.json /home/node/app/gateway
WORKDIR /home/node/app
COPY package*.json ./
COPY . ./

