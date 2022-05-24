FROM node:16-alpine
RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN npm i
EXPOSE 8080
CMD [ "node", "index.js" ]
