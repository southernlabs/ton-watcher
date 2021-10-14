const express = require('express');
const router = express.Router();

const ExternalMessage = require('../models/ExternalMessage');

/*
    Sample Waifuston functions
*/

// Gets messages with this waifu token
router.get("/waifu/:id", async function(req, res){
    var data = await ExternalMessage.find({"decoded.value.waifuIndex":req.params.id})
    res.json(data);
});

// Gets messages where user with given PubKey acts as owner,bidder,seller
router.get("/account_actions/:id", async function(req, res){
    var data = await ExternalMessage.find({
        $or: [ 
            {"decoded.value.from":req.params.id},{"decoded.value.to":req.params.id},{"decoded.value.seller":req.params.id},{"decoded.value.bidder":req.params.id},{"decoded.value.byuer":req.params.id} 
        ]
    })
    console.log(data)
    res.json(data);
});


module.exports = router