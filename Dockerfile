# # Build
# FROM node:10 as build
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm i
# COPY webpack.config.js gulpfile.js .babelrc ./
# COPY robots.txt ./
# COPY src ./src
# RUN npm run gulp
# RUN npm run build-app
# RUN npm run out


# # Run
# FROM node:8-alpine
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm i --production

# COPY --from=build /app/out ./src
# COPY --from=build /app/public ./public

# EXPOSE 3000

# CMD npm start


# FROM node:12-alpine as build
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm ci

# COPY . .
# RUN npm run build
# RUN npm run start & npm run export


# Run
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
# COPY --from=build /app/dist /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html