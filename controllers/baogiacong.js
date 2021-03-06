let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let baogiacong = mysql.createConnection(config);

router.get('/',function(req,res){
    baogiacong.find('all',function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/:id(\\d+)',function(req,res){
    baogiacong.find('first',{where: "MABAOGIACONG = '"+req.params.id+"'"},function(err,row){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row));
        }
    });
});
router.post('/', function(req, res){
    if(req.body.MABAOGIACONG && req.body.TENBAOGIACONG){
        baogiacong.set('MABAOGIACONG',req.body.MABAOGIACONG);
        baogiacong.set('TENBAOGIACONG',req.body.TENBAOGIACONG);
        baogiacong.set('DONGIACONG',req.body.DONGIACONG);
        baogiacong.set('GHICHU_BGC',req.body.GHICHU_BGC);
        baogiacong.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(baogiacong));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
router.put('/',function(req,res){
    if(req.body.TENBAOGIACONG)
    {
        baogiacong.set('TENBAOGIACONG',req.body.TENBAOGIACONG);
        baogiacong.set('DONGIACONG',parseInt(req.body.DONGIACONG));
        baogiacong.set('GHICHU_BGC',req.body.GHICHU_BGC);
        baogiacong.save("MABAOGIACONG='"+req.body.MABAOGIACONG+"'",function(err,row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(baogiacong));

            }
       });
    }
    else{
        res.send(result.error(2,"Missing field"));
    }
});
router.get('/taoma/mabaogiacong',function(req,res){
    baogiacong.query("SELECT createMaBaoGiaCong() as MABAOGIACONG",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row));
        }
    });
});
router.delete('/:id(\\d+)',function(req,res){
    baogiacong.find('count',{where :'MABAOGIACONG="'+req.params.id+'"'},function(err,kq){
        if(err)
        res.send(err);
        else if (kq>0){   
            baogiacong.remove('MABAOGIACONG="'+req.params.id+'"',function(err,row){
                    if(err)
                    {
                        res.send(result.error(1,'Database Error !'));
                    }
                    else
                    {
                        res.send(result.error(0,'Delete Successful !'));
                    }
                });
            } else{
                res.send(result.error(3,"Data Not Found !"));
            }
    });
});
module.exports =router;