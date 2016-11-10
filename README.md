# [ART.SHLISSELBURG.ORG](https://art.shlisselburg.org)
Art school of **Shlisselburg**

## Usage

### How to run

```bash
$ <ENV> npm start 
```

### Environments variables

#### PORT

TCP Port for app

```bash
PORT=8080 npm start
```

#### PRIVATE

Path to JSON file with secret keys

```bash
PRIVATE=private.json npm start
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

## Build client

```bash
$ NODE_ENV=production gulp deploy
```

For developer purposes:

```bash
$ gulp deploy
```

### Based on:
- [NodeJS](http://nodejs.org) 6.0
- [koa.js](http://koajs.com) 2.0
- [angular.js](https://angularjs.org) 1.5 
- [MongoDB](http://mongodb.org) 3.2

## Contributors
- Roman Timashev ([roman@tmshv.ru](mailto:roman@tmshv.ru))
