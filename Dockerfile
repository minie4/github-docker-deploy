FROM node:17-alpine3.12

RUN apk add --no-cache git

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
EXPOSE 80

ENV PORT=80
ENV FILE_PATH="/data"
VOLUME [ "/data" ]
CMD ["node", "index.js"]