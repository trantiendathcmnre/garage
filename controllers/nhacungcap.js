let express = require('express');
let mysql = require('mysql');
let moment = require('../node_modules/moment');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let nhacungcap = mysql.createConnection(config);

router.get('/enable', function(req,res){

    let query = "SELECT * FROM tgr_nha_cung_cap WHERE status = ? ";
    let attributes = [ 'ENABLED' ];
    nhacungcap.query( query , attributes, function(err,row) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});

router.get('/', function(req,res) {

    let query = "SELECT * FROM tgr_nha_cung_cap";
    nhacungcap.query( query ,function(err,rows,fields){
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/:id(\\d+)', function(req,res){

    let query = "SELECT * FROM tgr_nha_cung_cap WHERE id = ? ";
    let attributes = [ req.params.id ];
    nhacungcap.query( query , attributes, function(err,row) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});

router.post('/', function(req, res){
    if( req.body.ten && req.body.email && req.body.dia_chi ) {

        let query = "INSERT INTO tgr_nha_cung_cap (ten, dia_chi, dien_thoai, email, website, fax ) VALUES(?,?,?,?,?,?)";
        let attributes = [ 
                req.body.ten , 
                req.body.dia_chi, 
                req.body.dien_thoai, 
                req.body.email, 
                req.body.website, 
                req.body.fax, 
        ];
        nhacungcap.query(query, attributes, (err, results, fields) => {
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
        
    let query = "UPDATE tgr_nha_cung_cap SET dia_chi = ?, dien_thoai = ?, email = ?, website = ?, fax = ? WHERE id = ? ";
    let attributes = [ 
            req.body.dia_chi, 
            req.body.dien_thoai, 
            req.body.email, 
            req.body.website, 
            req.body.fax, 
            req.params.id
    ];
    nhacungcap.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records updated 
            res.send(response.message(results.affectedRows + " records updated"));
        }
    });
});

router.delete('/:id',function(req,res) {
    let query = "DELETE FROM tgr_nha_cung_cap WHERE id IN (" + req.params.id + ") ";
    nhacungcap.query(query, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records deleted 
            res.send(response.message(results.affectedRows + " records deleted"));
        }
    });
    
});

router.put('/disable/:id',function(req,res) { 
    let query = "UPDATE tgr_nha_cung_cap SET status = ? WHERE id IN (" + req.params.id + ")";
    let attributes = [ 'DISABLED' ];
    nhacungcap.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records updated 
            res.send(response.message(results.affectedRows + " records updated"));
        }
    });
});

router.put('/enable/:id',function(req,res) {
    let query = "UPDATE tgr_nha_cung_cap SET status = ? WHERE id IN (" + req.params.id + ")";
    let attributes = [ 'ENABLED' ];
    nhacungcap.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records updated 
            res.send(response.message(results.affectedRows + " records updated"));
        }
    });
});

module.exports =router;