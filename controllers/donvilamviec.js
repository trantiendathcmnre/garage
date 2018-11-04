let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let donvi = mysql.createConnection(config);

// get tat ca don vi lam viec
router.get('/',function(req,res) {
    donvi.query("SELECT * FROM tgr_don_vi_lam_viec", function (err, result, fields) {
        if (err) throw err;
        res.send(response.data(result));
    });
});

// get don vi lam viec theo id
router.get('/:id(\\d+)',function(req,res){
    donvi.query("SELECT * FROM tgr_don_vi_lam_viec WHERE id = ?", req.params.id, function (err, result, fields) {
        if (err) throw err;
        res.send(response.data(result));
    }); 
});

// them don vi lam viec moi 
router.post('/', function(req, res){
    if(req.body.ten) {

        let query = "INSERT INTO tgr_don_vi_lam_viec ( ten, mo_ta, status ) VALUES(?,?,?)";
        let attributes = [ req.body.ten, req.body.mo_ta, 'USE' ];

        donvi.query(query, attributes, (err, results, fields) => {
            if (err) throw err;
            // get inserted id
            res.send(response.message("Inserted id" + results.insertId));
        }); 

    } else {
        res.send(response.error(2,"Missing field"));
    }
});

// cap nhat thong tin don vi lam viec
router.put('/:id(\\d+)',function(req,res) {
    if(req.body.ten) {
        
        let query = "UPDATE tgr_don_vi_lam_viec SET ten = ? , mo_ta = ? WHERE id = ?";
        let attributes = [ req.body.ten, req.body.mo_ta, req.params.id ];

        donvi.query(query, attributes, (err, results, fields) => {
            if (err) throw err;
            // records updated 
            res.send(response.message(results.affectedRows + " records updated"));
        });

    } else {
        res.send(response.error(2,"Missing field"));
    }
});

// xoa don vi lam viec voi status TRASHED
router.delete('/:id',function(req,res) {
        
    let query = "UPDATE tgr_don_vi_lam_viec SET status = 'TRASHED' WHERE id = ?";
    let attributes = [ req.params.id ];

    donvi.query(query, attributes, (err, results, fields) => {
        if (err) throw err;
        // records updated 
        res.send(response.message(results.affectedRows + " records deleted"));
    });

});

module.exports =router;