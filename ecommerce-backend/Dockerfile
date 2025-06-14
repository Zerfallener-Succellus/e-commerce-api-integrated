FROM node:20-alpine

WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# Generate Prisma Client
RUN yarn prisma generate

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"] 