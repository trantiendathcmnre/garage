var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var NhaCungCap=Db.extend({tableName:"NHACUNGCAP"});
var nhacungcap=new NhaCungCap();
router.use(function(req,res,next){next();});
router.get('/',function(req,res){
    nhacungcap.find('all',function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/:id',function(req,res){
    nhacungcap.find('first',{where: "MANCC='"+req.params.id+"'"},function(err,row){
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
    if(req.body.MANCC && req.body.TENNCC){
        nhacungcap.set('MANCC',req.body.MANCC);
        nhacungcap.set('TENNCC',req.body.TENNCC);
        nhacungcap.set('DIACHI_NCC',req.body.DIACHI_NCC);
        nhacungcap.set('SDT_NCC',req.body.SDT_NCC);
        nhacungcap.set('EMAIL_NCC',req.body.SDT_NCC);
        nhacungcap.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(row));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
router.put('/',function(req,res){
    if(req.body.MANCC && req.body.TENNCC)
    {
        nhacungcap.set('MANCC',req.body.MANCC);
        nhacungcap.set('TENNCC',req.body.TENNCC);
        nhacungcap.set('DIACHI_NCC',req.body.DIACHI_NCC);
        nhacungcap.set('SDT_NCC',req.body.SDT_NCC);
        nhacungcap.set('EMAIL_NCC',req.body.EMAIL_NCC);
        nhacungcap.save("MANCC='"+req.body.MANCC+"'",function(err,row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(nhacungcap));

            }
       });
    }
    else{
        res.send(result.error(2,"Missing field"));
    }
});
router.delete('/:id',function(req,res){
    nhacungcap.find('count',{where :"MANCC='"+req.params.id+"'"},function(err,kq){
        if(err)
        res.send(err);
        else if (kq>0){   
            nhacungcap.remove("MANCC='"+req.params.id+"'",function(err,row){
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