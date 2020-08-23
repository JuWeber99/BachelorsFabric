FROM node:10.19.0-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
COPY . ./
CMD [ "node", "/home/node/app/dist/index.js"]

