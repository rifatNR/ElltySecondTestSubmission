FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

RUN npm build

CMD ["npm", "dev"]

# ! docker build -t ellty-core .
# ! docker run -p 3333:3333 ellty-core
# ! docker run -p 3333:3333 -v $(pwd):/app ellty-core
# ! docker run -p 3333:3333 -v $(pwd):/app -v /app/node_modules ellty-core
