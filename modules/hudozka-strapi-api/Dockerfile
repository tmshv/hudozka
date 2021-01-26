FROM node:14-alpine
RUN apk add --no-cache git
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build 

EXPOSE 80
ENV PORT 80
ENV NODE_ENV production

CMD ["sh", "-c", "npm start"]
