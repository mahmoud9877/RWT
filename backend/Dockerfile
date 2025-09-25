FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install && rm -rf node_modules/pdf-parse/test

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
