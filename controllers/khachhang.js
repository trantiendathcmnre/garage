let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let khachhang = mysql.createConnection(config);

// get all customers
router.get('/',function(req,res) {
    khachhang.query("SELECT * FROM tgr_khach_hang", function (err, result, fields) {
        if (err) throw err;
        res.send(response.data(result));
    });
});

//get customer by id
router.get('/:id(\\d+)',function(req,res){
    let query = "SELECT * FROM tgr_khach_hang WHERE id = ? ";
    let attributes = [ req.params.id ];
    khachhang.query( query , attributes, function(err,row) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});

// create new customer 
router.post('/', function(req, res){
    if( req.body.ma && req.body.ten && req.body.sdt  ){
        let query = "INSERT INTO tgr_khach_hang ( ma, ten, gioi_tinh, ngay_sinh, dia_chi, sdt, email, password ) VALUES(?,?,?,?,?,?,?,?)";
        let attributes = [ req.body.ma, req.body.ten, req.body.gioi_tinh, req.body.ngay_sinh, req.body.dia_chi, req.body.sdt, req.body.email, 'Aa@123456' ]; 
        khachhang.query(query, attributes, (err, results) => {
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

        let query = "UPDATE tgr_khach_hang SET ten = ?, gioi_tinh = ?, ngay_sinh = ?, dia_chi = ?, sdt = ?, email, password WHERE id = ?";
        let attributes = [ req.body.ten,  req.body.gioi_tinh, req.body.ngay_sinh, req.body.dia_chi, req.body.sdt, req.boby.email, req.body.password ];
        khachhang.query(query, attributes, (err, results, fields) => {
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
    let query = "DELETE FROM tgr_khach_hang WHERE id = ? ";
    let attributes = [ req.params.id ];
    khachhang.query(query, attributes, (err, results, fields) => {
        if (err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            // records deleted 
            res.send(response.message(results.affectedRows + " records deleted"));
        }
    });
});

//get customer by id
router.get('/generate',function(req,res){
    let query = "SELECT id FROM tgr_khach_hang ORDER BY id DESC LIMIT 1 OFFSET 0";
    khachhang.query( query , function(err,row) {
        let code = 'CS-';
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