let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let users = mysql.createConnection(config);

router.get('/',function(req,res){
    let query = "SELECT * FROM tgr_users";
    users.query(query, function(err,rows,fields) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.get('/:id(\\d+)', function(req,res){
    let query = "SELECT * FROM tgr_users WHERE id = ? ";
    let attributes = [ req.params.id ];
    users.query( query , attributes, function( err, row ) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});


router.post('/', function(req, res){
    if(req.body.account) {
        let query = "INSERT INTO tgr_users ( account, password, fullname, phone, email, status, created_at ) VALUES(?,?,?,?,?,?,?)";
        let attributes = [ 
            req.body.account, 
            req.body.password, 
            req.body.fullname, 
            req.body.phone, 
            req.body.email, 
            '1',
            req.body.created_at
        ];
        users.query(query, attributes, (err, results, fields) => {
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


//phan nguoi dung vao nhom
router.post('/phannguoidungvaonhom', function(req, res){
    let query = "DELETE FROM tgr_detail_group_user WHERE id_user = ?";
    let attributes = [ req.body.is_user ];
    if(req.body){
        users.query(query, attributes, function(err,row,fields) {
            if(err) {
                res.send(response.error(1,"Database Error !"));
            }
            else {
                let dem = 0;
                for( let i of req.body.data ) {
                    let query = "INSERT INTO tgr_detail_group_user VALUES(?,?)";
                    let attributes = [
                        req.body.id,
                        req.body.id_user
                    ];
                    users.query(query, attributes, function(err, row) {
                        if(err) {
                            res.send(response.error(1,"Database Error !"));
                        } else {
                            
                        }
                    });
                    dem++;
                }
                if( dem == req.body.data.length )
                    res.send(response.data(row));
            }
        });
    } else {
        res.send(response.error(2,"Missing field"));
    }
});

//get thong tin nguoi dung theo account
router.get('/thongtin/:id(\\d+)',function(req,res){
    let query = "SELECT * FROM tgr_users WHERE account = ? ";
    let attributes = [ req.params.id ];
    users.query( query , attributes, function( err, row ) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(row));
        }
    });
});

module.exports = router;