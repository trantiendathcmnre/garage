let express = require('express');
let mysql = require('mysql');
let fs = require('fs');
// let md5 = require('md5');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let danhmucphutung = mysql.createConnection(config);
let moment = require('../node_modules/moment');
let now = moment().format('YYYY-MM-DD HH:mm:ss');
let query = '';
let attributes = [];
let headerCSV = '';
let filename = '';
let pathFile = '';
let newFile = '';

router.get('/', function(req,res) {
    query = "SELECT dm.id, dm.ten as ten_danh_muc, dm.mo_ta, dv.ten AS ten_don_vi, dm.created_at as ngay_tao FROM tgr_danh_muc_phu_tung dm LEFT JOIN tgr_don_vi_lam_viec dv ON dm.donvi_id=dv.id ORDER BY dm.created_at DESC";
    danhmucphutung.query( query ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/:id(\\d+)', function(req,res){
    query = "SELECT * FROM tgr_danh_muc_phu_tung WHERE id = ? ";
    attributes = [ req.params.id ];
    danhmucphutung.query( query , attributes, function(err,row) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});

router.post('/', function(req, res){
    if(req.body.ten) {
        query = "INSERT INTO tgr_danh_muc_phu_tung ( ten, mo_ta, donvi_id ) VALUES(?,?,?)";
        attributes = [ req.body.ten, req.body.mo_ta, req.body.donvi_id, now ];
        danhmucphutung.query(query, attributes, (err, results, fields) => {
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

router.put('/:id(\\d+)',function(req,res) {
    query = "UPDATE tgr_danh_muc_phu_tung SET mo_ta = ?, updated_at = ? WHERE id = ?";
    attributes = [ req.body.mo_ta, now, req.params.id ];
    danhmucphutung.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records updated 
            res.send(response.message(results.affectedRows + " records updated"));
        }
    });
});

router.delete('/:id(\\d+)',function(req,res) {
    query = "DELETE FROM tgr_danh_muc_phu_tung WHERE id = ? ";
    attributes = [ req.params.id ];
    danhmucphutung.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records deleted 
            res.send(response.message(results.affectedRows + " records deleted"));
        }
    });
    
});

router.get('/search/:id(\\d+)', function(req,res) {
    query = "SELECT dm.id, dm.ten as ten_danh_muc, dm.mo_ta, dv.ten AS ten_don_vi, dm.created_at as ngay_tao from tgr_danh_muc_phu_tung dm ";
    query += "INNER JOIN tgr_don_vi_lam_viec dv ";
    query += "ON dm.donvi_id = dv.id and dv.id = ?";
    attributes = [req.params.id];
    danhmucphutung.query( query, attributes ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/export-csv', function(req, res) {
    headerCSV = "'Tên danh mục phụ tùng' AS ten, 'Thuộc đơn vị' AS ten_donvi, 'Mô tả' AS mo_ta, 'Ngày tạo' AS created_at ";
    filename = 'export_danh_muc_phu_tung_' + (moment().format('MM_DD_YYYY_HH_mm_ss_a'))+'.csv';
    pathFile = '/tmp/' + filename;
    newFile = __dirname.replace('/controllers','/uploads/') + filename;
    query  = "SELECT " + headerCSV + " UNION ALL ";
    query += "SELECT dm.ten, dv.ten AS ten_donvi, dm.mo_ta, dm.created_at from tgr_danh_muc_phu_tung dm ";
    query += "LEFT JOIN tgr_don_vi_lam_viec dv ON dm.donvi_id = dv.id  ";
    query += "INTO OUTFILE '" + pathFile + "' CHARACTER SET UTF8 FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'";
    danhmucphutung.query( query ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,err));
        } else {
            var is = fs.createReadStream(pathFile);
            var os = fs.createWriteStream(newFile);

            is.pipe(os);
            fs.chmod(newFile, 0777);
            is.on('end',function() {
                res.send(response.data(filename));
            });
        }
    });
});

module.exports =router;
