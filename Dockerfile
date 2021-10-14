FROM node:lts-alpine

# Configure apline (we need ld-linux-x86-64.so.2 ). Another way we can try using debian image instead of alpine
RUN apk add gcompat

WORKDIR /app

COPY . ./

RUN npm install

# Prefetch old messages
RUN npm run fetch

EXPOSE 8080

CMD [ "npm", "run", "start" ]