const {TonClient} = require("@tonclient/core");
const {libNode} = require("@tonclient/lib-node");
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
require('dotenv').config()

const uri = process.env.MONGODB_URI
const watchAddress = process.env.WATCH_ADDRESS
const PORT = process.env.PORT || 8080

const watchAbi = require("./abis/CryptoNeuralWaifu.abi.json");
const ExteranlMessage = require('./models/ExternalMessage');

const app = express();
app.use(cors())

const Schema = mongoose.Schema;

TonClient.useBinaryLibrary(libNode);
const client = new TonClient({network: { 
    endpoints: JSON.parse(process.env.ENDPOINTS)
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
                const msg = new ExteranlMessage({id:params.result.id, decoded: decoded, created_at: params.result.created_at})
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

/*
    Sample Waifuston functions
*/
// Gets messages with this waifu token
app.get("/waifu/:id", async function(req, res){
    var data = await ExteranlMessage.find({"decoded.value.waifuIndex":req.params.id})
    res.json(data);
});
// Gets messages where user with given PubKey acts as owner,bidder,seller
app.get("/account_actions/:id", async function(req, res){
    var data = await ExteranlMessage.find({
        $or: [ 
            {"decoded.value.from":req.params.id},{"decoded.value.to":req.params.id},{"decoded.value.seller":req.params.id},{"decoded.value.bidder":req.params.id},{"decoded.value.byuer":req.params.id} 
        ]
    })
    console.log(data)
    res.json(data);
});

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
