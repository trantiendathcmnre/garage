let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let hangxe = mysql.createConnection(config);

router.get('/', function(req,res) {

    let query = "SELECT * FROM tgr_hang_xe";
    hangxe.query( query ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/:id(\\d+)', function(req,res){

    let query = "SELECT * FROM tgr_hang_xe WHERE id = ? ";
    let attributes = [ req.params.id ];
    hangxe.query( query , attributes, function(err,row) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});


router.post('/', function(req, res){
    if(req.body.ten) {
        let query = "INSERT INTO tgr_hang_xe (ma, ten, mo_ta, trang_thai_hang_xe ) VALUES(?,?,?,?)";
        let attributes = [ req.body.ma,req.body.ten , req.body.mo_ta, req.body.trang_thai_hang_xe ];
        hangxe.query(query, attributes, (err, results, fields) => {
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
        
    let query = "UPDATE tgr_hang_xe SET ten = ?, mo_ta = ? WHERE id = ?";
    let attributes = [req.body.ten , req.body.mo_ta, req.params.id ];
    hangxe.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records updated 
            res.send(response.message(results.affectedRows + " records updated"));
        }
    });
});

router.delete('/:id(\\d+)',function(req,res) {

    let query = "DELETE FROM tgr_hang_xe WHERE id = ? ";
    let attributes = [ req.params.id ];
    hangxe.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records deleted 
            res.send(response.message(results.affectedRows + " records deleted"));
        }
    });
    
});

//generate hang xe
router.get('/generate',function(req,res){
    let query = "SELECT id FROM tgr_hang_xe ORDER BY id DESC LIMIT 1 OFFSET 0";
    hangxe.query( query , function(err,row) {
        let code = 'AM-';
        let nextId = 0;

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

module.exports =router;