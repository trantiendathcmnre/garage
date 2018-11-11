let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let nhanvien = mysql.createConnection(config);

router.get('/',function(req,res){
    nhanvien.query('SELECT * FROM tgr_nhan_vien',function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

//get tat ca nhan vien dang lam viec trong garage
router.get('/hoatdong',function(req,res){
    nhanvien.query('SELECT * FROM tgr_nhan_vien WHERE trang_thai = 1', function(err,rows,fields) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/donvi/:id(\\d+)',function(req,res){
    nhanvien.query('SELECT * FROM tgr_nhan_vien WHERE id_don_vi = ' + req.params.id,function(err,rows,fields) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/:id(\\d+)',function(req,res){
    nhanvien.query('SELECT * FROM tgr_nhan_vien WHERE id = ' + req.params.id, function(err,row) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});

router.post('/', function(req, res){
    if(req.body.ten) {
        let query = "INSERT INTO tgr_nhan_vien ( ma, ten, ngay_sinh, gioi_tinh, dia_chi, email, sdt, trang_thai, id_don_vi ) VALUES(?,?,?,?,?,?,?,?,?)";
        let attributes = [ 
            req.body.ma, 
            req.body.ten, 
            req.body.ngay_sinh, 
            req.body.gioi_tinh, 
            req.body.dia_chi, 
            req.body.email, 
            req.body.sdt, 
            req.body.trang_thai, 
            req.body.id_don_vi 
        ];
        nhanvien.query(query, attributes, (err, results, fields) => {
            if (err) {
                res.send(response.error(1,"Database Error !"));
            } else {
                // get inserted id
                res.send(response.message("Inserted id " + results.insertId));
            }
        }); 

    } else {
        res.send(response.error(2,"Missing field"));
    }
});

router.get('/taoma/manhanvien',function(req,res){
    nhanvien.query("SELECT createMaNhanVien() as MANHANVIEN",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            console.log(row);
            res.send(result.data(row));
        }
    });
});

router.put('/',function(req,res){
    if(req.body.MANHANVIEN && req.body.TENNHANVIEN){
        nhanvien.set('TENNHANVIEN',req.body.TENNHANVIEN);
        nhanvien.set('GIOITINHNV',req.body.GIOITINHNV);
        nhanvien.set('NGAYSINHNV',req.body.NGAYSINHNV);
        nhanvien.set('DIACHINV',req.body.DIACHINV);
        nhanvien.set('SDT',req.body.SDT);
        nhanvien.set('EMAIL',req.body.EMAIL);
        nhanvien.set('TRANGTHAINV',req.body.TRANGTHAINV);
        nhanvien.set('MADONVI',req.body.MADONVI);
        nhanvien.save("MANHANVIEN='"+req.body.MANHANVIEN+"'",function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(row));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});

module.exports =router;