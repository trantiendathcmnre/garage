var express = require('express');
var router = express.Router();
var response = require('../modules/response-result');
const accountSid = 'AC4cc242ad9748cf8602d199bb802629ad';
const authToken = '3d520be9da9b490bdad77b72ae17812c';
const client = require('twilio')(accountSid, authToken);


router.post('/',function(req,res){
    console.log('+84'+ req.body.to.substring(1, req.body.to.length))
    client.messages.create({
        to: '+84'+ req.body.to.substring(1, req.body.to.length),
        from: '+1 205 346 5211',
        body: req.body.text
    })
    .then((messages) => res.send(response.data(messages.sid)));

});

module.exports = router;
