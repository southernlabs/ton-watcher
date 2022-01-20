# TON Watcher (Ever Watcher)

by [waifuston.com](https://waifuston.com)

👉 Check out our new [complete True NFT toolset](https://github.com/southernlabs/tnft-generator). With that tool you can setup your own True NFT collection. Check out `api-server` component for updated code.

A simple Free TON external messages listener & DB logger.

We using this app in production to fetch every token history at waifuston.com. We store messages in blockchain via emitting events and to get these events we need some type of middleware. TON Watcher listens to events, decodes them, and stores them into a database. Then we can easily get events via HTTP API.

Based on TON SDK examples: https://github.com/tonlabs/sdk-samples/tree/master/low-level/node-js/core-api/listen-and-decode

Read how to use and modify this code: https://southernlabs.gitbook.io/ton-watcher/

## Features:

- MongoDB backend
- Fetch all messages to DB
- Simple HTTP API for DB queries
- Messages subscription

## How to use

- Change code as you want
- Setup ENV variables: network, watch address, abi and mongodb uri
- Run `npm run fetch` to fetch all External messages from blockchain to MongoDB
- Start the app `npm run start`

### ENV
```
MONGODB_URI=mongodb://localhost:27017/watcher
WATCH_ADDRESS=0:1cc19337587036a64f1806efdc9a3c34862181ac771b9424bd7c3e75bade58c4
ENDPOINTS=["https://main1.ton.dev/","https://main2.ton.dev/","https://main3.ton.dev/"]
PORT=8080
ABI_FILE=./abis/CryptoNeuralWaifu.abi.json
```
