FROM node:20-alpine as build

WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# Add TSC_COMPILE_ON_ERROR=true to ignore TypeScript errors during build
ENV TSC_COMPILE_ON_ERROR=true
RUN yarn build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 