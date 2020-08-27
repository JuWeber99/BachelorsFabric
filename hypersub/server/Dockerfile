FROM node:10.19.0-alpine

RUN mkdir -p /hypersub/server/node_modules
RUN mkdir /hypersub/server/gateway/
#COPY /home/balr/Developement/BachelorsFabric/organizations/peerOrganizations/nexnet.hypersub.com/connection-nexnet.json /hypersub/server/gateway
WORKDIR /hypersub/server
COPY package*.json ./
RUN npm install
COPY . ./

