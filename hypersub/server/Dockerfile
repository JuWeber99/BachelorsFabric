FROM node:10.19.0-alpine


RUN mkdir -p /home/node/app/node_modules
WORKDIR /home/node/app
RUN mkdir gateway && chown -R node:node /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
COPY . ./

