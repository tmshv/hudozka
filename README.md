# [ART.SHLISSELBURG.ORG](https://art.shlisselburg.org)

Site of Art school of Shlisselburg

## Usage

### Build

```bash
$ docker build -t tmshv/hudozka .
```

### How to run

#### Add .env file

```
MONGO_HUDOZKA_PASSWORD=<strong_password>
HUDOZKA_DB_URI=mongodb://hudozka:strong_password@mongo:27017/hudozka?authSource=admin
```

#### Run
```bash
$ docker-compose up -d
```

### How to sync data base

Local DB to remote DB

```bash
DB=hudozka
HOST=<ip_address>
USER=<mongo_user>
PWD=<mongo_password>
mongodump -d ${DB} --gzip --archive | mongorestore -h ${HOST} -u ${USER} -p ${PWD} -d ${DB} --gzip --archive
```

## Based on:
- [NodeJS](http://nodejs.org) 10.0
- [koa.js](http://koajs.com) 2.0
- [React](https://react.org) 16.3
- [MongoDB](http://mongodb.org) 3.6

## Contributors
- Roman Timashev ([roman@tmshv.ru](mailto:roman@tmshv.ru))
