let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let donvitinh = mysql.createConnection(config);

router.get('/',function(req,res){
    let query = "SELECT *  from tgr_don_vi_tinh";
    donvitinh.query( query ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/:id(\\d+)',function(req,res){
    let query = "SELECT *  from tgr_don_vi_tinh WHERE id = ?";
    let attributes = [ req.params.id ];
    donvitinh.query( query, attributes ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.post('/', function(req, res){
    if( req.body.ten ){

        let query = "INSERT INTO tgr_don_vi_tinh ( ten, ghi_chu ) VALUES(?,?)";
        let attributes = [ req.body.ten, req.body.ghi_chu ];
        donvitinh.query(query, attributes, (err, results, fields) => {
            if (err) {
                res.send(response.error(1,"Database Error !"));
            } else {
                // get inserted id
                res.send(response.message("Inserted id " + results.insertId));
            }
        }); 
    }else{
        res.send(response.error(2,"Missing field"));
    }
});

router.put('/:id(\\d+)',function(req,res){
    if(req.body.ten)
    {
        let query = "UPDATE tgr_don_vi_tinh SET ghi_chu = ?, ten = ? WHERE id = ?";
        let attributes = [ req.body.ghi_chu, req.body.ten, req.params.id ];
        donvitinh.query(query, attributes, (err, results, fields) => {
            if (err) {
                res.send(response.error(1,"Database Error !"));
            } else {
                // get updated id
                res.send(response.message(results.affectedRows + " records updated"));
            }
        }); 
    }
    else{
        res.send(result.error(2,"Missing field"));
    }
});

router.delete('/:id(\\d+)',function(req,res){

    let query = "DELETE FROM tgr_don_vi_tinh WHERE id = ? ";
    let attributes = [ req.params.id ];
    donvitinh.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records deleted 
            res.send(response.message(results.affectedRows + " records deleted"));
        }
    });
});

module.exports =router;
