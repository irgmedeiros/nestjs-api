# nestjs-api-mongoose

Simple example Api Rest with Nestjs 8.x and Mongoose for the NestJS community 😻.

## Installation

```bash
$ npm install
```

## Set environment

```
$ cp .env.example .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker

There is a `docker-compose.yml` file for starting MongoDB with Docker.

`$ docker-compose up`

After running, you can stop the Docker container with

`$ docker-compose down`

## Url Swagger for Api Documentation
```
http://127.0.0.1:3000/api/doc
```

## Getting with Curl Customers

```bash
    $ curl -H 'content-type: application/json' -v -X GET http://127.0.0.1:3000/api/customers  
    $ curl -H 'content-type: application/json' -v -X GET http://127.0.0.1:3000/api/customers/:id 
    $ curl -H 'content-type: application/json' -v -X POST -d '{"corporateName": "corporateName #1", "phone": "1234567890", "address": "street 1", "createdAt": "15/06/2022", "revenue": 1000000, "bankAccounts": "BankAccountId"}' http://127.0.0.1:3000/api/customers 
    $ curl -H 'content-type: application/json' -v -X PUT -d '{"corporateName": "corporateName #1", "phone": "1234567890", "address": "street 1", "createdAt": "15/06/2022", "revenue": 1000000, "bankAccounts": "BankAccountId"}' http://127.0.0.1:3000/api/customers/:id 
    $ curl -H 'content-type: application/json' -v -X DELETE http://127.0.0.1:3000/api/customers/:id 
```

## Getting with Curl Bank Accounts

```bash
    $ curl -H 'content-type: application/json' -v -X GET http://127.0.0.1:3000/api/bankAccounts  
    $ curl -H 'content-type: application/json' -v -X GET http://127.0.0.1:3000/api/bankAccounts/:id 
    $ curl -H 'content-type: application/json' -v -X POST -d '{"bankName":"Foo bar", "agency": "123", "account": "444555-6"}' http://127.0.0.1:3000/api/bankAccounts 
    $ curl -H 'content-type: application/json' -v -X PUT -d '{"bankName":"Foo bar", "agency": "123", "account": "444555-6"}' http://127.0.0.1:3000/api/bankAccounts/:id 
    $ curl -H 'content-type: application/json' -v -X DELETE http://127.0.0.1:3000/api/bankAccounts/:id
```

## Getting Pagination using limit and offset

```bash 
    $ curl -H 'content-type: application/json' -v -X GET http://127.0.0.1:3000/api/customers?limit=10
```

```bash 
    $ curl -H 'content-type: application/json' -v -X GET http://127.0.0.1:3000/api/customers?offset=10
```
