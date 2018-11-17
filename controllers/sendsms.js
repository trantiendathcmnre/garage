var express = require('express');
var router = express.Router();
var response = require('../modules/response-result');
const accountSid = 'AC4cc242ad9748cf8602d199bb802629ad';
const authToken = '3d520be9da9b490bdad77b72ae17812c';
const client = require('twilio')(accountSid, authToken);


router.post('/',function(req,res){
    client.messages.create({
        to: '+84377526881',
        from: '+1 205 346 5211',
        body: 'This is sms'
    })
    .then((messages) => console.log(messages.sid));
});

module.exports = router;
