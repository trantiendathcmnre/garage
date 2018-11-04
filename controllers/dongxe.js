let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let dongxe = mysql.createConnection(config);

router.get('/',function(req,res){

    let query = "SELECT dx.*, hx.ten AS ten_hangxe  from tgr_dong_xe dx , tgr_hang_xe hx where dx.hangxe_id = hx.id";
    dongxe.query( query ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/:id(\\d+)', function(req,res){

    let query = "SELECT * FROM tgr_dong_xe WHERE id = ? ";
    let attributes = [ req.params.id ];
    dongxe.query( query , attributes, function(err,row) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});

router.post('/', function(req, res){
    if( req.body.ten && req.body.hangxe_id){

        let query = "INSERT INTO tgr_dong_xe ( ten, mo_ta, hangxe_id ) VALUES(?,?,?)";
        let attributes = [ req.body.ten, req.body.mo_ta, req.body.hangxe_id ];
        dongxe.query(query, attributes, (err, results, fields) => {
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
    if(req.body.hangxe_id && req.body.ten) {

        let query = "UPDATE tgr_dong_xe SET mo_ta = ? WHERE id = ?";
        let attributes = [ req.body.mo_ta ];
        dongxe.query(query, attributes, (err, results, fields) => {
            if (err) {
                res.send(response.error(1,"Database Error !"));
            } else {
                // get updated id
                res.send(response.message(results.affectedRows + " records updated"));
            }
        }); 
    }
    else{
        res.send(response.error(2,"Missing field"));
    }
});

router.delete('/:id(\\d+)',function(req,res){
    let query = "DELETE FROM tgr_dong_xe WHERE id = ? ";
    let attributes = [ req.params.id ];
    dongxe.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records deleted 
            res.send(response.message(results.affectedRows + " records deleted"));
        }
    });
});

router.get('/search/:id(\\d+)', function(req,res) {

    let query = "SELECT dx.*, hx.ten AS ten_hangxe from tgr_dong_xe dx ";
    query += "INNER JOIN tgr_hang_xe hx ";
    query += "ON dx.hangxe_id = hx.id and hx.id = ?";
    let attributes = [req.params.id];
    dongxe.query( query, attributes ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

module.exports =router;
