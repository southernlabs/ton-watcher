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
- Setup ENV variables: network, watch address, abi and mongodb uri
- Run `npm run fetch` to fetch all External messages from blockchain to MongoDB
- Start the app `npm run start`

### ENV
```
MONGODB_URI=mongodb+srv://
WATCH_ADDRESS=0:1cc19337587036a64f1806efdc9a3c34862181ac771b9424bd7c3e75bade58c4
ENDPOINTS=["https://main1.ton.dev/","https://main2.ton.dev/","https://main3.ton.dev/"]
PORT=5000
```
