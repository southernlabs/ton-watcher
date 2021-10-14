const {TonClient} = require("@tonclient/core");
const {libNode} = require("@tonclient/lib-node");
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
require('dotenv').config()

const uri = process.env.MONGODB_URI
const watchAddress = process.env.WATCH_ADDRESS
const PORT = process.env.PORT || 8080

const watchAbi = require(process.env.ABI_FILE || "./abis/CryptoNeuralWaifu.abi.json");
const ExternalMessage = require('./models/ExternalMessage');

const app = express();
app.use(cors())

TonClient.useBinaryLibrary(libNode);
const client = new TonClient({network: { 
    endpoints: JSON.parse(process.env.ENDPOINTS || ["https://main1.ton.dev/","https://main2.ton.dev/","https://main3.ton.dev/"])
}});


(async () => {
    try {
        await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        const messageSubscription = await client.net.subscribe_collection({
            collection: "messages",
            filter: {msg_type:{eq:2}, src:{eq:watchAddress}},
            result: "id,created_at,body",
        }, async (params, responseType) => {
            try {

                const decoded = await decodeMessage(params.result.body)
                const msg = new ExternalMessage({id:params.result.id, decoded: decoded, created_at: params.result.created_at})
                await msg.save();

                console.log("Got new message!")
            } catch (err) {
                console.log('>>>', err);
            }
        });

        /** Free up all internal resources associated with wallets. */
        //await client.net.unsubscribe(messageSubscription);
    } catch (error) {
        console.error(error);
    }
    //client.close();
})();

const routes = require("./api-routes");
app.use(routes);

app.get("/", (req, res)=>{
    res.send(`TON Watcher: 
    <a href="https://github.com/southernlabs/ton-watcher">github.com/southernlabs/ton-watcher</a> <br>
    Docs: 
    <a href="https://southernlabs.gitbook.io/ton-watcher/">southernlabs.gitbook.io/ton-watcher/</a>`)
})

console.log("App started at port: ",PORT)
app.listen(PORT);

async function decodeMessage(body){
    var params = {
            abi: { value: watchAbi, type:'Contract' },
            body: body,
            is_internal: false
        }
    var decoded = await client.abi.decode_message_body(params);
    //console.log( decoded)
    return decoded;
}
