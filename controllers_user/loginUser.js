var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var KhachHang=Db.extend({tableName:"khachhang"});
var khachhang=new KhachHang();
router.post('/login', function(req, res){
    if(req.body.SDT_KH)
    khachhang.find('first', {where:"SDT_KH='"+req.body.SDT_KH+"'"}, function(err, row) {
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }
        else
        {
            if(row.SDT_KH)
            {
                if(row.USERPASSWORD==req.body.USERPASSWORD)
                {
                    res.send(result.data(row));
                }
                else
                res.send({"errorCode":0,"errorMessage":"Mật khẩu không chính xác"});
            }
            else
            res.send({"errorCode":2,"errorMessage":"Số điện thoại chưa được đăng kí"});
        }
    });
    else
    res.send({"errorCode":3,"errorMessage":"Missing field"});
});
module.exports =router;