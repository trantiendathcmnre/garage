let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let xe = mysql.createConnection(config);

router.get('/',function(req,res){
    xe.query("SELECT * from tgr_xe x, tgr_dong_xe dx, tgr_hang_xe hx WHERE dx.hangxe_id = hx.id AND x.id_dong_xe = dx.id ", function(err,rows,fields) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

//get xe theo trang thai xe
router.get('/trangthai/:id(\\d+)',function(req,res){
    xe.query("SELECT x.id, dx.ten AS ten_dong_xe, kh.ten AS ten_khach_hang, bien_so, so_vin, so_khung, mau_xe, ngay_cap_nhat, trang_thai FROM tgr_khach_hang kh, tgr_xe x, tgr_dong_xe dx, tgr_hang_xe hx WHERE dx.hangxe_id = hx.id AND x.id_dong_xe = dx.id AND kh.id = x.id_khach_hang AND x.trang_thai = '" + req.params.id + "'",function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/makhachhang/:id(\\d+)',function(req,res){
    xe.query("SELECT x.*, dx.ten AS ten_dong_xe, hx.ma AS ma_hang_xe, hx.ten AS ten_hang_xe  FROM tgr_xe x, tgr_dong_xe dx, tgr_hang_xe hx WHERE dx.hangxe_id = hx.id AND x.id_dong_xe = dx.id AND x.id_khach_hang = '" + req.params.id + "'", function(err,rows,fields) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/:id(\\d+)',function(req,res){
    xe.query("SELECT * FROM tgr_xe WHERE id = '"+req.params.id + "'", function(err,row) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});

router.post('/', function(req, res){
    if( req.body.so_vin && req.body.bien_so && req.body.so_khung ){
        let query = "INSERT INTO tgr_xe ( id_dong_xe, id_khach_hang, bien_so, so_vin, so_khung, so_may, so_km, doi_xe, mau_xe, ngay_cap_nhat, trang_thai ) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
        let attributes = [ 
            req.body.id_dong_xe,  
            req.body.id_khach_hang, 
            req.body.bien_so, 
            req.body.so_vin, 
            req.body.so_khung, 
            req.boby.so_may, 
            req.body.so_km,
            req.body.doi_xe,  
            req.body.mau_xe, 
            req.body.ngay_cap_nhat, 
            req.body.trang_thai
        ];
        xe.query(query, attributes, function (err, row) {
            if(err){
                res.send(response.error(1,"Database Error !"));
            }else {
                res.send(response.data(row));
            }
        });
    }else{
        res.send(response.error(2,"Missing field"));
    }
});

router.put('/:id(\\d+)', function(req, res){
    let query = "UPDATE tgr_xe SET so_vin = ?, so_khung = ?, so_may = ?, so_km = ?, doi_xe = ?, mau_xe = ?, ngay_cap_nhat = ? , trang_thai = ? WHERE id = ?";
    let attributes = [ 
        req.body.so_vin, 
        req.body.so_khung, 
        req.boby.so_may, 
        req.body.so_km,
        req.body.doi_xe,  
        req.body.mau_xe, 
        req.body.ngay_cap_nhat, 
        req.body.trang_thai,
        req.params.id
    ];
    xe.query(query, attributes, function (err, row) {
        if(err){
            res.send(response.error(1,"Database Error !"));
        }else {
            res.send(response.data(row));
        }
    });
});

//xac nhan them xe cho khach hang
router.post('/xacnhanxe', function(req, res){
    if(req.body.id){
        xe.query("UPDATE tgr_xe SET trang_thai = 1 WHERE id = " + req.body.id, function(err, row){
            if(err) {
                res.send(response.error(1,"Database Error !"));
            } else {
                res.send(response.data(row));
            }
        });
    } else {
        res.send(response.error(2,"Missing field"));
    } 
});

//get so dien thoai cua khach hang theo xe
router.get('/SDT_KH/:id',function(req,res){
    console.log(req.params.id);
    xe.query("SELECT kh.sdt, x.bien_so FROM tgr_khach_hang kh, tgr_xe x WHERE kh.id = x.id_khach_hang AND x.id = '" + req.params.id + "'", function(err,row,fields) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row[0]));
        }
    });
});

//get cac xe dang sua chua de cho vao kho sua
router.get('/dsxe/dangsua',function(req,res){
    xe.query("SELECT * FROM tgr_dong_xe dx, tgr_xe x, tgr_phieu_kiem_tra pkt, tgr_don_hang dh WHERE dx.id = x.id_dong_xe AND pkt.id_xe = x.id AND pkt.id = dh.id_phieu_kham AND dh.trang_thai IN ('2','3')", function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

module.exports =router;