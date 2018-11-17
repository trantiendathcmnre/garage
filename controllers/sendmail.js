var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var response = require('../modules/response-result');

router.post('/',function(req,res){

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            clientId: '894892792387-91tkql7sa3m0i5iil8vv3ticl7t2au4g.apps.googleusercontent.com',
            clientSecret: 'DOXqerOGubo4wKrxq1Fm0n44'
        }
    });

    let mailOptions = {
        from: 'Phu Thong Garage ✔ <tr.tiendat.hcmunre@gmail.com>',
        to: req.body.to,
        subject: req.body.subject,
        generateTextFromHTML: true,
        html: req.body.html,
        auth: {
            user: 'tr.tiendat.hcmunre@gmail.com',
            refreshToken: '1/xDAay4EgnzU9ST2sJbHzFsQaG9HC5N4pCkpuTGmyuF-gCJy4-kgVcHl3t1thE29Z',
            accessToken: 'ya29.GltXBnEAvYq6kMd9ICB5YLQ-ByfK1Wj9oLGXFwpTuJeH7BPFomnKZQmd4PYQSHL_WBkXO8M_mZYFoKT4EuWkOLW_ZFDPcSD7BNdviXYN-tjYl-nC1f5bPr3Y31Tm',
            expires: 3600
        }
    }

    transporter.sendMail(mailOptions, function(err, respon) {
        if(err) {
            res.send(response.error(err));
        } else {
            res.send(response.data(respon));
        }   
        transporter.close();
    });
    transporter.close();
});

module.exports = router;
