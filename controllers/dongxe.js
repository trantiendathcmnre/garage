var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var DongXe=Db.extend({tableName:"tgr_dong_xe"});
var dongxe=new DongXe();
router.get('/',function(req,res){
    dongxe.query("SELECT * from tgr_dong_xe dx,tgr_hang_xe hx where dx.hangxe_id=hx.id",function(err,rows,fields){
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
    dongxe.find('first',{where: "id = '"+req.params.id+"'"},function(err,row){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row));
        }
    });
});
router.get('/hangxe_id/:id',function(req,res){
    dongxe.find('all',{where: "hangxe_id = '"+req.params.id+"'"},function(err,rows){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(rows));
        }
    });
});
router.post('/', function(req, res){
    console.log(req.body);
    if(req.body.id && req.body.ten){
        dongxe.set('id',req.body.id);
        dongxe.set('ten',req.body.ten);
        dongxe.set('mo_ta',req.body.mo_ta);
        dongxe.set('hangxe_id',req.body.hangxe_id);
        dongxe.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(dongxe));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
router.put('/',function(req,res){
    if(req.body.id && req.body.ten)
    {
        dongxe.set('ten',req.body.ten);
        dongxe.set('mo_ta',req.body.mo_ta);
        dongxe.set('hangxe_id',req.body.hangxe_id);
        dongxe.save("id='"+req.body.id+"'",function(err,row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(dongxe));

            }
       });
    }
    else{
        res.send(result.error(2,"Missing field"));
    }
});
router.delete('/:id',function(req,res){
    dongxe.find('count',{where :'id="'+req.params.id+'"'},function(err,kq){
        if(err)
        res.send(err);
        else if (kq>0){   
            dongxe.remove('id="'+req.params.id+'"',function(err,row){
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
// router.get('/taoma/id',function(req,res){
//     dongxe.query("SELECT createid() as id",function(err,row,fields){
//         if(err)
//         {
//             res.send(result.error(1,"Database Error !"));
//         } else
//         {
//             res.send(result.data(row));
//         }
//     });
// });
module.exports =router;