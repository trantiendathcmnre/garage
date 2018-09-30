var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var Donvitinh=Db.extend({tableName:"donvitinh"});
var donvitinh=new Donvitinh();
router.get('/',function(req,res){
    donvitinh.find('all',function(err,rows,fields){
        if(err)
        {
            res.send(err);
            // res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/:id',function(req,res){
    donvitinh.find('first',{where: "ID_DVT ="+req.params.id},function(err,row){
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
    if(req.body.TENDVT){
        donvitinh.set('TENDVT',req.body.TENDVT);
        donvitinh.set('GHICHU_DVT',req.body.GHICHU_DVT);
        donvitinh.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(donvitinh));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
router.put('/',function(req,res){
    if(req.body.TENDVT)
    {
        donvitinh.set('TENDVT',req.body.TENDVT);
        donvitinh.set('GHICHU_DVT',req.body.GHICHU_DVT);
        donvitinh.save("ID_DVT="+req.body.ID_DVT,function(err,row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(donvitinh));

            }
       });
    }
    else{
        res.send(result.error(2,"Missing field"));
    }
});
router.delete('/:id',function(req,res){
    donvitinh.find('count',{where :'ID_DVT='+req.params.id},function(err,kq){
        if(err)
        res.send(err);
        else if (kq>0){   
            donvitinh.remove('ID_DVT='+req.params.id,function(err,row){
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