let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let phieukiemtra = mysql.createConnection(config);

router.get('/loaiphieu/:id',function(req,res){
    phieukiemtra.query("SELECT * FROM tgr_phieu_kiem_tra pkt, tgr_xe xe, tgr_dong_xe dx WHERE pkt.trang_thai_phieu_kiem_tra <> '2' and pkt.id_xe = xe.id and xe.id_dong_xe = dx.id ",function(err,rows,fields){
        if(err) {
            res.response(response.error(1,"Database Error !"));
        } else {
            res.response(response.data(rows));
        }
    });
});

//get phieu kiem tra sua chữa theo xe-tiep nhan sua chua
router.get('/xe/:id(\\d+)',function(req,res){
    var query = "SELECT pkt.id AS id_phieu_kham,pkt.nguoi_lap, pkt.ngay_lap, pkt.yeu_cau_kiem_tra, pkt.noi_dung_kham, pkt.trang_thai_phieu_kiem_tra AS trang_thai_phieu_kham, ";
    query += "x.bien_so, x.so_vin, x.so_khung, x.so_may, x.so_km, x.doi_xe, x.mau_xe, x.ngay_cap_nhat AS ngay_cap_nhat_xe, ";
    query += "x.trang_thai AS trang_thai_xe, dx.hangxe_id AS hang_xe, dx.ten AS ten_dong_xe, dx.mo_ta AS mo_ta_dong_xe  ";
    query += "FROM tgr_phieu_kiem_tra pkt, tgr_xe x, tgr_dong_xe dx WHERE pkt.id_xe = x.id AND x.id_dong_xe = dx.id AND x.id =" + req.params.id ;
    phieukiemtra.query(query,function(err, rows, fields) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

// get nhan vien 
router.get('/nhanvien/:id(\\d+)',function(req,res){
    phieukiemtra.query("SELECT * FROM tgr_phieu_kiem_tra pkt, tgr_chi_tiet_phieu_kham_nhan_vien ct, tgr_nhan_vien nv WHERE nv.id = ct.id_nhan_vien AND pkt.id = ct.id_phieu_kham AND pkt.id = '" + req.params.id + "'",function(err,rows,fields) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/xe-khachhang/:id(\\d+)',function(req,res){
    phieukiemtra.query("SELECT * FROM tgr_phieu_kiem_tra pkt, tgr_xe x,tgr_khach_hang kh,tgr_dong_xe dx WHERE dx.id = x.id_dong_xe AND pkt.id_xe = x.id AND kh.id = x.id_khach_hang AND pkt.id = '" + req.params.id + "'",function(err,rows,fields) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.post('/', function(req, res){
    if(req.body.ten) {
        let query = "INSERT INTO tgr_phieu_kiem_tra ( id_xe, ngay_lap, yeu_cau_kiem_tra, noi_dung_kiem_tra, trang_thai ) VALUES(?,?,?,?,?)";
        let attributes = [ req.body.id_xe, req.body.ngay_lap, req.body.yeu_cau_kiem_tra, req.body.noi_dung_kiem_tra, '1' ];
        phieukiemtra.query(query, attributes, (err, results, fields) => {
            if (err) {
                res.send(response.error(1,"Database Error !"));
            } else {
                for(let i of req.body.nhan_vien) {
                    phieukiemtra.query("INSERT INTO tgr_chi_tiet_phieu_kham_nhan_vien ( id_nhan_vien, id_phieu_kham ) VALUES(" + i.id_nhan_vien + ", " + results.insertId + ")", function(err, results, fields) {
                        if (err) 
                            res.send(response.error(1,"Database Error !"));
                    });
                    
                }
                // get inserted id
                res.send(response.message("Inserted id " + results.insertId));
            }
        }); 

    } else {
        res.send(response.error(2,"Missing field"));
    }
});

router.post('/phieukham/xacnhan', function(req, res){
    phieukiemtra.set('TRANGTHAIPK',req.body.TRANGTHAIPK);
    phieukiemtra.query("UPDATE tgr_phieu_kiem_tra SET trang_thai = "+ req.body.trang_thai +" WHERE id = " + req.body.id_phieu_kham, function(err,row) {
        if(err){
            res.send(response.error(1,"Database Error !"));
        }else {
            res.send(response.data(row));

        }
   });
});

//lay hey nhung nhan vien dang lam viec-khong the phan nhiem vu tiep theo
router.get('/phieukham/nhanvien/danglamviec',function(req,res){
    phieukiemtra.query("SELECT * FROM tgr_chi_tiet_phieu_kham_nhan_vien ct WHERE ct.trang_thai = '0'", function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

module.exports =router;