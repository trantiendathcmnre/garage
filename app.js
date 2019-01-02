let express = require('express');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let app = express();
let config = require('./modules/db');
let response = require('./modules/response-result');
let login = mysql.createConnection(config);
let route = '';
let token = '';
let query = '';
let attributes = [];
let now = '';
let timeout = '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use('/img', express.static(__dirname+'/img'));
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    route = req.url.split('/');
    route = '/' + route[1];
    if(route != '/users') {
        if( !!req.headers.authorization) {
            token = req.headers.authorization.substring(7).trim();
            if(!!token) {
                query = "SELECT * FROM tgr_users WHERE token = ? ";
                attributes = [token];
                login.query( query, attributes, function(err, row, fields) {
                    if(err) {
                        res.send(response.error(1, err));
                    } else {
                        if(row.length > 0) {
                            now = new Date();
                            if(row.expired_time < now) {
                                res.send(response.error(5, 'Expired Time Token!'));
                            } else {
                                //Neu co tuong tac thi tang thoi gian song cua token len
                                timeout = now;
                                query = "UPDATE tgr_users SET token = ? WHERE id = ?";
                                attributes = [new Date(timeout.getTime() + 30*60000), row.id];
                                login.query(query, attributes, function () {
                                    if(err) 
                                        res.send(response.error(1, err));
                                    else 
                                        next();
                                });
                            }
                        } else
                            res.send({"errorCode":6,"errorMessage":'Invalid Access Token!'});
                    }
                });
            } else
                res.send(result.error(7,'Invalid Access Token!'));
        }
        else
            res.send({"errorCode":5,"errorMessage":'Missing Access Token!'});
    } else
    next();
});

app.get('/test', function(req, res) {
    res.send('test success!');
});

//Use controller nha cung cap
var nhacungcap = require('./controllers/nhacungcap');
app.use('/nha-cung-cap', nhacungcap);
// Use controller hang xe
var hangxe = require('./controllers/hangxe');
app.use('/hang-xe', hangxe);
//Use controller dong xe
var dongxe = require('./controllers/dongxe');
app.use('/dong-xe', dongxe);
//Use controller don vi lam viec
var donvi = require('./controllers/donvilamviec');
app.use('/don-vi-lam-viec', donvi);
//Use controller danh muc phu tung
var danhmucphutung = require('./controllers/danhmucphutung');
app.use('/danh-muc-phu-tung', danhmucphutung);
//Use controller phu tung
var phutung = require('./controllers/phutung');
app.use('/phu-tung', phutung);
// //Use controller phieunhap
// var phieunhap=require('./controllers/phieunhap');
// app.use('/phieunhap',phieunhap);
//Use controller phieu dat hang
var phieudathang = require('./controllers/phieudathang');
app.use('/lap-phieu-dat', phieudathang);
//Use controller khach hang
var khachhang = require('./controllers/khachhang');
app.use('/khach-hang',khachhang);
//Use controller xe
var xe = require('./controllers/xe');
app.use('/xe',xe);
//Use controller nhan vien
var nhanvien = require('./controllers/nhanvien');
app.use('/nhan-vien',nhanvien);
//Use controller phieu kiem tra
var phieukham = require('./controllers/phieukham');
app.use('/phieu-kham',phieukham);
//Use controller bao gia cong
var baogiacong = require('./controllers/baogiacong');
app.use('/bao-gia-cong',baogiacong);
//Use controller don hang
var donhang=require('./controllers/donhang');
app.use('/don-hang',donhang)
//Use controller don vi tinh
var donvitinh = require('./controllers/donvitinh');
app.use('/don-vi-tinh',donvitinh);
//Use user
var users = require('./controllers/users');
app.use('/users',users);
//Use sendmail
var sendmail = require('./controllers/sendmail');
app.use('/send-mail', sendmail );
//Use send sms
var sendsms = require('./controllers/sendsms');
app.use('/send-sms', sendsms );
// //Use nhom nguoi dung
// var nhomnguoidung=require('./controllers/nhomnguoidung');
// app.use('/nhomnguoidung',nhomnguoidung);
//Use nguoi dung
var nguoidung = require('./controllers/nguoidung');
app.use('/nguoi-dung',nguoidung);
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