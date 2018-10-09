let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let danhmucphutung = mysql.createConnection(config);

router.get('/', function(req,res) {

    let query = "SELECT dm.*, dv.ten AS ten_donvi from tgr_danh_muc_phu_tung dm LEFT JOIN tgr_don_vi_lam_viec dv ON dm.donvi_id=dv.id";
    danhmucphutung.query( query ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/:id', function(req,res){

    let query = "SELECT * FROM tgr_danh_muc_phu_tung WHERE id = ? ";
    let attributes = [ req.params.id ];
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

        let query = "INSERT INTO tgr_danh_muc_phu_tung ( ten, mo_ta, donvi_id ) VALUES(?,?,?)";
        let attributes = [ req.body.ten, req.body.mo_ta, req.body.donvi_id ];
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

router.put('/:id',function(req,res) {
        
    let query = "UPDATE tgr_danh_muc_phu_tung SET mo_ta = ? WHERE id = ?";
    let attributes = [ req.body.mo_ta, req.params.id ];
    danhmucphutung.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records updated 
            res.send(response.message(results.affectedRows + " records updated"));
        }
    });
});

router.delete('/:id',function(req,res) {

    let query = "DELETE FROM tgr_danh_muc_phu_tung WHERE id = ? ";
    let attributes = [ req.params.id ];
    danhmucphutung.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records deleted 
            res.send(response.message(results.affectedRows + " records deleted"));
        }
    });
    
});

router.get('/search/:id', function(req,res) {

    let query = "SELECT dm.*, dv.ten AS ten_donvi from tgr_danh_muc_phu_tung dm ";
    query += "INNER JOIN tgr_don_vi_lam_viec dv ";
    query += "ON dm.donvi_id = dv.id and dv.id = ?";
    let attributes = [req.params.id];
    danhmucphutung.query( query, attributes ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

module.exports =router;