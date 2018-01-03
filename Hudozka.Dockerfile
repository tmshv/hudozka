# Build
FROM node:8 as build
WORKDIR /app

COPY package.json package-lock.json gulpfile.babel.js .babelrc ./
RUN npm i

COPY src ./src
RUN npm run gulp deploy
RUN npm run out


# Run
FROM node:8-alpine
WORKDIR /app

COPY package.json package-lock.json gulpfile.babel.js .babelrc ./
RUN npm i --production

COPY --from=build /app/out ./src
COPY --from=build /app/public ./public

EXPOSE 3000

CMD npm start