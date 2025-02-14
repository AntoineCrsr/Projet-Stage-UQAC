FROM node:latest
 
WORKDIR /app
 
COPY . .

RUN rm -rf node_modules package-lock.json && npm install
 
CMD [ "node", "server.js" ]