FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# current port
EXPOSE 3005

CMD ["npm", "start"]