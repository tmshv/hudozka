# Build
FROM node:10 as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i
COPY webpack.config.js gulpfile.js .babelrc ./
COPY robots.txt ./
COPY src ./src
RUN npm run gulp
RUN npm run build-app
RUN npm run out


# Run
FROM node:8-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i --production

COPY --from=build /app/out ./src
COPY --from=build /app/public ./public

EXPOSE 3000

CMD npm start