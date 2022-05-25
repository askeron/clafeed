FROM node:16-alpine
RUN mkdir -p /app
WORKDIR /app
ADD backend /app
RUN npm i
EXPOSE 8080
CMD [ "node", "index.js" ]
