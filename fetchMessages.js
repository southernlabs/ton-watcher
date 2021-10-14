const {TonClient} = require("@tonclient/core");
const {libNode} = require("@tonclient/lib-node");
const mongoose = require("mongoose");
require('dotenv').config()

const uri = process.env.MONGODB_URI
const watchAddress = process.env.WATCH_ADDRESS

const watchAbi = require(process.env.ABI_FILE || "./abis/CryptoNeuralWaifu.abi.json");

const ExternalMessage = require('./models/ExternalMessage');

TonClient.useBinaryLibrary(libNode);

const client = new TonClient({network: { 
    endpoints: JSON.parse(process.env.ENDPOINTS) || ["https://main1.ton.dev/","https://main2.ton.dev/","https://main3.ton.dev/"]
}});

(async () => {
    try {
        await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        getMessages();

    } catch (error) {
        console.error(error);
    }
})();

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

async function getMessages(time = (Date.now()/1000)+10000){
    var msgs = await client.net.query_collection({
        collection: "messages",
        filter: {msg_type:{eq:2}, src:{eq:watchAddress}, created_at: {lt:time}},
        limit: 50,
        order: [ {path:"created_at",direction:'DESC'} ],
        result: "id,created_at,body",
        
    });

    msgs.result.forEach(async (e) => {
        try{
            let decoded = await decodeMessage(e.body)
            const msg = new ExternalMessage({id:e.id, decoded: decoded, created_at: e.created_at})
            await msg.save();
        }catch(err){
             console.log(err);
        }
    })

    console.log("👋 Got "+msgs.result.length+" messages")

    if(msgs.result.length > 0 && msgs.result[msgs.result.length - 1].created_at != time)
        getMessages(msgs.result[msgs.result.length - 1].created_at)
    else
        console.log("🚩 Fetch task ended")
}