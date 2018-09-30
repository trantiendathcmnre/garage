var express=require('express');
var router=express.Router();
var nodemailer = require('nodemailer');
var result=require('../modules/response-result');
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'vanquy05dhth3@gmail.com',
          pass: 'xngrrlxygxydqxsf'
        }
      });
router.post('/',function(req,res){
    let to='vuvanson0203@gmail.com';
    let subject='THÔNG BÁO SỬA CHỮA XE THÀNH CÔNG';
    let text='Xe đã sửa chữa xong';
    var mailOptions = {
        from: 'vanquy05dhth3@gmail.com',
        to: to,
        subject: subject,
        text: text
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send(result.error(1,"Error !"));
        } else {
            res.send(result.error(0,"Success !"));
        }
      });
});
module.exports =router;
