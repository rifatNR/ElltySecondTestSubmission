FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 4444

CMD ["pnpm", "dev"]

# ! docker build -t ellty-web .
# ! docker run -p 4444:4444 ellty-web
# ! docker run -p 4444:4444 -v $(pwd):/app -v /app/node_modules ellty-web