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

router.get('/:id', function(req,res){

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
    if(req.body.ma) {

        let query = "INSERT INTO tgr_hang_xe (ma, ten, mo_ta ) VALUES(?,?,?)";
        let attributes = [ req.body.ma,req.body.ten , req.body.mo_ta ];
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

router.delete('/:id',function(req,res) {

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

module.exports =router;