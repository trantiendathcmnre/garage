let express = require('express');
let mysql = require('mysql');
let moment = require('../node_modules/moment');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let phieudat = mysql.createConnection(config);

router.get('/', function(req,res) {
    let query  = "SELECT DISTINCT pd.id, pd.ma, pd.ngay_lap, pd.nguoi_lap, pd.tong_phu_tung, pd.ghi_chu, pd.trang_thai, ncc.ten ";
    query += "FROM tgr_phieu_dat_hang pd, tgr_phu_tung pt, tgr_nha_cung_cap ncc, tgr_chi_tiet_phieu_dat_phu_tung ct ";
    query += "where pt.id_nha_cung_cap = ncc.id AND ct.id_phu_tung = pt.id and ct.id_phieu_dat_hang = pd.id ";
    phieudat.query( query ,function(err, rows, fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

//get phieu dat
router.get('/phieu/:id',function(req,res){
    let query = "SELECT DISTINCT pd.id, pd.ma, pd.ngay_lap, pd.nguoi_lap, pd.tong_phu_tung, pd.ghi_chu, pd.trang_thai, ";
    query += "ncc.ten, ncc.id AS id_nha_cung_cap, ncc.dia_chi, ncc.dien_thoai ";
    query += "FROM tgr_phieu_dat_hang pd, tgr_phu_tung pt, tgr_nha_cung_cap ncc, tgr_chi_tiet_phieu_dat_phu_tung ct ";
    query += "where pt.id_nha_cung_cap = ncc.id and ct.id_phu_tung = pt.id and ct.id_phieu_dat_hang = pd.id and pd.id = " + req.params.id ;
    phieudat.query( query ,function(err, rows, fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

//get chi tiet phieu dat
router.get('/:id(\\d+)',function(req,res){
    let query = "SELECT ct.id_phu_tung, pt.ten_phu_tung AS ten_phu_tung, dvt.ten AS ten_don_vi_tinh, ct.so_luong_dat, ct.id_phieu_dat_hang ";
    query += "FROM tgr_chi_tiet_phieu_dat_phu_tung ct, tgr_phu_tung pt, tgr_don_vi_tinh dvt ";
    query += "WHERE dvt.id = pt.id_don_vi_tinh AND pt.id = ct.id_phu_tung AND ct.id_phieu_dat_hang = " + req.params.id ;
    phieudat.query( query ,function(err, rows, fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/ncc/:id',function(req,res){
    let query = "SELECT DISTINCT pd.ma , pd.ngay_lap FROM tgr_phieu_dat_hang pd, tgr_phu_tung pt, tgr_nha_cung_cap ncc, tgr_chi_tiet_phieu_dat_phu_tung ct ";
    query += "WHERE pt.id_nha_cung_cap = ncc.id AND ct.id_phu_tung = pt.id AND ct.id_phieu_dat_hang = pd.id AND ncc.id = '" + req.params.id + "' AND pd.trang_thai = '2'";
    phieudat.query( query ,function(err, rows, fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.post('/', function(req, res){
    var soLuongDat = 0;
    for (i of req.body.data) {
        soLuongDat += i.so_luong_dat;
    }
    if( req.body.phieu.ma ) {

        let query = "INSERT INTO tgr_phieu_dat_hang ( ma, id_nha_cung_cap, ngay_lap, nguoi_lap, tong_phu_tung, ghi_chu ) VALUES(?,?,?,?,?,?)";
        let attributes = [ 
            req.body.phieu.ma, 
            req.body.phieu.id_nha_cung_cap, 
            req.body.phieu.ngay_lap,
            req.body.phieu.nguoi_lap,
            soLuongDat,
            req.body.phieu.ghi_chu
        ];
        phieudat.query(query, attributes, (err, results, fields) => {
            if (err) {
                //console.log(err);
                res.send(response.error(1,err));
            } else {
                //Luu chi tiet phieu dat
                
                for (i of req.body.data) {
                    //console.log(i);
                    luuChiTietPhuTung(results.insertId, i.id_phu_tung, i.so_luong_dat);
                }
                // get inserted id
                res.send(response.message("Inserted id " + results.insertId));
            }
        }); 
    }else {
        res.send(response.error(2,"Missing field"));
    }
});


router.post('/dsphieudat/xacnhan', function(req, res){
    if(req.body.id) {
        let query = "UPDATE tgr_phieu_dat_hang SET trang_thai = ? WHERE id = ?";
        let attributes = [ req.body.trang_thai, req.body.id ];
        phieudat.query( query , attributes, function(err, rows, fields){
            if(err) {
                res.send(response.error(1,"Database Error !"));
            } else {
                res.send(response.data(rows));
            }
        });
    }
    else {
        res.send(response.error(2,"Missing field"));
    }
});

// router.put('/', function(req, res){
//     var soLuongDat = 0;
//      for (i of req.body.data)
//      {
//         soLuongDat+=i.SOLUONGDAT;
//      }
//     if(req.body.phieu.MAPHIEUDATHANG){
//         phieudat.set('TONGSOPT',soLuongDat);
//         phieudat.set('GHICHU_PD',req.body.phieu.GHICHU_PD);
//         phieudat.save("MAPHIEUDATHANG='"+req.body.phieu.MAPHIEUDATHANG+"'",function(err, row){
//             if(err){
//                 res.send(result.error(1,"Database Error !"));
//             }else {
//                 //Xoa chi tiet phu tung cu
//                 ct_phieudat.query("DELETE FROM chitiet_pd_pt WHERE MAPHIEUDATHANG='"+req.body.phieu.MAPHIEUDATHANG+"'",function(err,row,fields){
//                     if(err)
//                     {
//                         res.send(result.error(1,"Database Error !"));
//                     }
//                     else
//                     {
//                         for (i of req.body.data) {
//                             console.log(i);
//                             luu_ct_pd(req.body.phieu.MAPHIEUDATHANG,i.MAPHUTUNG,i.SOLUONGDAT);
//                          }
//                          res.send(result.data(phieudat));
//                     }
//                 })  
//             }
//         });
//     }else{
//         res.send(result.error(2,"Missing field"));
//     }
// });

router.get('/generate',function(req,res){
    let query = "SELECT id FROM tgr_phieu_dat_hang ORDER BY id DESC LIMIT 1 OFFSET 0";
    phieudat.query( query , function(err,row) {
        let code = 'OR-';
        let nextId = 0;
        //res.send(response.data( JSON.stringify(row) ));
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            if(row.length != 0 && row[0].id > 0) {
                nextId = row[0].id + 1;
                code += nextId;
                res.send(response.data( code ));
            } 
            code += 100000;
            res.send(response.data( code ));
        }
    });
});

function luuChiTietPhuTung(id_phieu, id_phu_tung, so_luong) {
    let query = "INSERT INTO tgr_chi_tiet_phieu_dat_phu_tung ( id_phieu_dat_hang, id_phu_tung, so_luong_dat ) VALUES(?,?,?)";
    let attributes = [ id_phieu, id_phu_tung, so_luong ];
    phieudat.query(query, attributes, (err, results, fields) => {
    });   
}
module.exports =router;