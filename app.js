var express = require('express');
var bodyParser = require('body-parser');
// var multer = require('multer');
// var fs = require('fs');
var app = express();
// var upload = multer({dest:"tmp/"});
// var result = require('./modules/response-result');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use('/img', express.static(__dirname+'/img'));
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    // var s=req.url.split('/');
    // s='/'+s[1];
    // if(s!='/users' && s!='/ulogin' && s!='/ukhachhang' && s!='/uxe' && s!='/udongxe' && s!='/uphutung' && s!='/usuachua')
    // {
    //     if(req.headers.authorization)
    //     {
    //         var token=req.headers.authorization.substring(7).trim();
    //         console.log(req.headers.authorization);
    //         console.log(token);
    //     if(token)
    //     {
    //         var Db=require('./modules/db');
    //         var User=Db.extend({tableName:"users"});
    //         var user=new User();
    //         user.find('first', {where: "TOKEN='"+token+"'"}, function(err,row) {
    //         if(err)
    //         {
    //             res.send(result.error(1,"Database Error !"));
    //         }
    //         else
    //         {
    //             if(row.TOKEN)
    //             {
    //                 var day=new Date();
    //                 if(row.EXPIREDTIME<day)
    //                 {
    //                 res.send(result.error(5,'Expired Time Token!'));
    //                 }
    //                 else
    //                 {
    //                 //Neu co tuong tac thi tang thoi gian song cua token len
    //                 var timeout=new Date();
    //                 user.set("EXPIREDTIME",new Date(timeout.getTime() + 30*60000));
    //                 user.save("USE_ID="+row.USE_ID,function(err,row){
    //                     if(err)
    //                     res.send(result.error(1,"Database Error !"));
    //                     else
    //                     next();
    //                 });
    //                 }
    //             }
    //             else
    //             {
    //                 res.send({"errorCode":6,"errorMessage":'Invalid Access Token!'});
    //             }
    //         }
    //     });
    //     }
    //     else
    //     res.send(result.error(7,'Invalid Access Token!'));
    //     }
    //     else
    //     {
    //         res.send({"errorCode":5,"errorMessage":'Missing Access Token!'});
    //     }
    // }
    // else{
     next();
    // }
  });

app.get('/test', function(req, res) {
    res.send('test success!');
});

//Use controller nha cung cap
var nhacungcap = require('./controllers/nhacungcap');
app.use('/nhacungcap', nhacungcap);
// Use controller hang xe
var hangxe = require('./controllers/hangxe');
app.use('/hangxe', hangxe);
//Use controller dong xe
var dongxe = require('./controllers/dongxe');
app.use('/dongxe', dongxe);
//Use controller don vi lam viec
var donvi = require('./controllers/donvilamviec');
app.use('/donvilamviec', donvi);
//Use controller danh muc phu tung
var danhmucphutung = require('./controllers/danhmucphutung');
app.use('/danhmucphutung', danhmucphutung);
//Use controller phu tung
var phutung = require('./controllers/phutung');
app.use('/phutung', phutung);
// //Use controller phieunhap
// var phieunhap=require('./controllers/phieunhap');
// app.use('/phieunhap',phieunhap);
//Use controller phieu dat hang
var phieudathang = require('./controllers/phieudathang');
app.use('/lapphieudat', phieudathang);
//Use controller khach hang
var khachhang = require('./controllers/khachhang');
app.use('/khachhang',khachhang);
//Use controller xe
var xe = require('./controllers/xe');
app.use('/xe',xe);
//Use controller nhan vien
var nhanvien = require('./controllers/nhanvien');
app.use('/nhanvien',nhanvien);
//Use controller phieu kiem tra
var phieukham = require('./controllers/phieukham');
app.use('/phieukham',phieukham);
//Use controller bao gia cong
var baogiacong = require('./controllers/baogiacong');
app.use('/baogiacong',baogiacong);
//Use controller don hang
var donhang=require('./controllers/donhang');
app.use('/donhang',donhang)
//Use controller don vi tinh
var donvitinh = require('./controllers/donvitinh');
app.use('/donvitinh',donvitinh);
//Use user
var users = require('./controllers/users');
app.use('/users',users);
//Use sendmail
var sendmail = require('./controllers/sendmail');
app.use('/sendmail', sendmail );
//Use send sms
var sendsms = require('./controllers/sendsms');
app.use('/sendsms', sendsms );
// //Use nhom nguoi dung
// var nhomnguoidung=require('./controllers/nhomnguoidung');
// app.use('/nhomnguoidung',nhomnguoidung);
//Use nguoi dung
var nguoidung = require('./controllers/nguoidung');
app.use('/nguoidung',nguoidung);
// //Use bao tri
// var baotri=require('./controllers/baotri');
// app.use('/baotri',baotri);
// //Use phieuxuat
// var phieuxuat=require('./controllers/phieuxuat');
// app.use('/phieuxuat',phieuxuat);
// //Use thong ke
// var thongke=require('./controllers/thongke');
// app.use('/thongke',thongke);


// //controller cho user khach hang------------------
// var ulogin=require('./controllers_user/loginUser');
// app.use('/ulogin',ulogin);
// //user KH
// var ukhachhang=require('./controllers_user/khachhangUser');
// app.use('/ukhachhang',ukhachhang);
// //Use XE
// var uxe=require('./controllers_user/xeUser');
// app.use('/uxe',uxe);
// //Use DONGXE
// var udongxe=require('./controllers_user/dongxeUser');
// app.use('/udongxe',udongxe);
// //Use PHUTUNG
// var uphutung=require('./controllers_user/phutungUser');
// app.use('/uphutung',uphutung);
// //Use LSSC
// var usuachua=require('./controllers_user/donhangUser');
// app.use('/usuachua',usuachua);
//------------------------------------------------
const p = process.env.PORT || 8000;
var server = app.listen(p,function(){
    var host = server.address().address;
    //var host="103.70.28.56";
    var port = server.address().port;
    console.log('Server is listening at http://%s:%s',host,port);
});