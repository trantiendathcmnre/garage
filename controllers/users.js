let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let user = mysql.createConnection(config);
const uuidv4 = require('uuid/v4');

router.post('/',function(req,res){
    if( req.body.account && req.body.password ) {
        let query = "SELECT * FROM tgr_user WHERE account = ? AND password = ? ";
        let attributes = [ req.body.account, req.body.password ];
        user.query(query, attributes, (err, results, fields) => {
            if (err) {
                res.send(response.error(1,"Database Error !"));
            } else {
                // get inserted id
                res.send(response.message("Inserted id " + results.insertId));
                if( row.account ) {
                    var timeout = new Date();
                    var datasend = {
                        "userId":row.id,
                        "account":row.account,
                        "fullName":row.fullname,
                        "accessToken":''
                    };
                    if( row.expired_time > timeout ) {
                            //con su dung duoc
                        if( row.token ) {
                                //update lai thoi gentime
                            var token = row.token;
                            var expired_time = new Date(timeout.getTime() + 30*60000);
                            var query = "UPDATE tgr_users SET expired_time = ? WHERE id = ?";
                            var attributes = [ expired_time, row.id ];
                            user.query(query, attributes, (err, results, fields) => {
                                if(err)
                                    res.send(response.error(1,"Database Error !"));
                                else {
                                    datasend.accessToken = token;
                                    res.send(response.data(datasend));
                                }
                            });
                        } else {
                            //tai khoan moi chua co token
                            var token = uuidv4();
                            var expired_time = new Date(timeout.getTime() + 30*60000);
                            var query = "INSERT INTO tgr_users( token, expired_time ) VALUES (?,?)";
                            var attributes = [token, expired_time];
                            user.query(query, attributes, (err, results, fields) => {
                                if(err)
                                    res.send(response.error(1,"Database Error !"));
                                else {
                                    datasend.accessToken = token;
                                    res.send(response.data(datasend));
                                }
                            });
                        }
                    } else {
                        //timeout 
                        var token = uuidv4();
                        var expired_time = new Date(timeout.getTime() + 30*60000);
                        var query = "UPDATE tgr_users SET token = ?, expired_time = ? WHERE id = ?";
                        var attributes = [token, expired_time, row.id ];
                        user.query(query, attributes, (err, results, fields) => {
                            if(err)
                                res.send(response.error(1,"Database Error !"));
                            else {
                                datasend.accessToken = token;
                                res.send(response.data(datasend));
                            }
                        });
                    }
                } else {
                    //sai tai khoan
                    res.send(response.error(2,"Wrong User name or Password"));
                }
            }
        }); 
    } else {
        res.send(response.error(3,"Missing User name or Password"));
    }
});

//get nhóm quyen cua nguoi dung
router.get('/nhomquyen/:id',function(req,res) {
    var query = "SELECT * FROM tgr_detail_group_user WHERE id = "+ req.params.id;

    user.query(query,function( err,rows,fields ) {
        if(err) {
            res.send(response.error(1,"Database Error !"));
        } else {
            res.send(response.data(rows));
        }
    });
});

router.post('/dsquyen',function(req,res){
    var quyen=[];
    if(req.body.dsnhom.length == 0)
    {
        user.query("SELECT id FROM tgr_menu", function () {
            if(err) {
                res.send(response.error(1,"Database Error !"));
            } else {
                for(let i of rows) {
                    quyen.push({
                        "id":i.id,
                        "is_role":0
                    });
                }
                res.send(repose.data(quyen));

            }
        });
    }
    else {
        user.query('SELECT COUNT(*) FROM tge_menu', function(err, kq) {
            if(err) {
                res.send(response.error(1,"Database Error !"));
            }
            else  {
    
                var dem = req.body.dsnhom.length*kq;
                var dem1 = 0;
                for(let i of req.body.dsnhom) {
                    roles.query("SELECT * FROM tgr_roles WHERE id_group = " + i.id_group , function(err,rows,fields){
                        if(err) {
                            res.send(response.error(1,"Database Error !"));
                        }
                        else {
                            for(let j of rows) {
                                dem1  =dem1 + 1;
                                quyen.push({
                                    "id_menu": j.id_menu,
                                    "is_role": j.is_role
                                });
                                if( dem1 == dem ) {
                                    for(x=0;x<quyen.length-1;x++)
                                        for(y=x+1;y<quyen.length;y++) {
                                            if( quyen[x].id_menu == quyen[y].id_menu ) {
                                                if(quyen[x].is_role == 1 || quyen[y].is_role == 1 ) {
                                                    quyen[x].is_role = 1;
                                                    quyen.splice( y,1 );
                                                }
                                            }
                                        }
                                    res.send(response.data(quyen));
                                    //console.log(quyen);
                                }
                               
                            }
                        }
                    });
            
                }
            }
        });  
    }
    
});
module.exports =router;
