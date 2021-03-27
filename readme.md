# TON Watcher

by [waifuston.com](https://waifuston.com)

A simple Free TON external messages listener & DB logger

TON SDK examples: https://github.com/tonlabs/sdk-samples/tree/master/low-level/node-js/core-api/listen-and-decode

## Features:

- MongoDB backend
- Fetch all messages to DB
- Simple http api for DB queries
- Messages subscription

## How to

- Change code as you want
- Setup network, watch address, abi and mongodb uri
- Run `npm run fetch` to fetch all External messages from blockchain to MongoDB
- Start the app `npm run start`

## TODO

- Change all hardcoded variables to ENV variables
- ???