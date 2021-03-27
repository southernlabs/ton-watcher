const {TonClient} = require("@tonclient/core");
const {libNode} = require("@tonclient/lib-node");
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');

const uri = "mongodb+srv://"
const watchAddress = "0:1cc19337587036a64f1806efdc9a3c34862181ac771b9424bd7c3e75bade58c4"
const PORT = 5000

const watchAbi = require("./abis/CryptoNeuralWaifu.abi.json");
const ExteranlMessage = require('./models/ExternalMessage');
const app = express();
app.use(cors())
const Schema = mongoose.Schema;
TonClient.useBinaryLibrary(libNode);
const client = new TonClient({
  network: { 
      server_address: 'https://main.ton.dev' // 'net.ton.dev'
  } 
});


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
