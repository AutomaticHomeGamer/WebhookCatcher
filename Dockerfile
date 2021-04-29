FROM node:latest
RUN mkdir -p /usr/src/app
COPY package.json /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
ENV webPort=8000
ENV mongoPort=27017
EXPOSE ${webPort} 
CMD ["sh", "-c", "node Webhook.js ${mongoPort} ${webPort}" ]