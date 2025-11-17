FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm@9.15.9

RUN pnpm install --ignore-workspace --no-frozen-lockfile

COPY . .

EXPOSE 3333

RUN pnpm build

CMD ["pnpm", "dev"]

# ! docker build -t ellty-core .
# ! docker run -p 3333:3333 ellty-core
# ! docker run -p 3333:3333 -v $(pwd):/app ellty-core
# ! docker run -p 3333:3333 -v $(pwd):/app -v /app/node_modules ellty-core
