var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var HangXe=Db.extend({tableName:"tgr_hang_xe"});
var hangxe=new HangXe();

router.get('/',function(req,res){
    hangxe.find('all',function(err,rows,fields){
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
    hangxe.find('first',{where: "id = '"+req.params.id+"'"},function(err,row){
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
    if(req.body.ma && req.body.ten){
        hangxe.set('ma',req.body.ma);
        hangxe.set('ten',req.body.ten);
        hangxe.set('mo_ta',req.body.mo_ta);
        hangxe.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(row));
            }
        });
    } else {
        res.send(result.error(2,"Missing field"));
    }
});

router.put('/',function(req,res){
    if(req.body.ten)
    {
        hangxe.set('ten',req.body.ten);
        hangxe.set('mo_ta',req.body.mo_ta);
        hangxe.save("ma='"+req.body.ma+"'",function(err,row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(hangxe));

            }
       });
    }
    else{
        res.send(result.error(2,"Missing field"));
    }
});
router.delete('/:id',function(req,res){
    hangxe.find('count',{where :'id="'+req.params.id+'"'},function(err,kq){
        if(err)
        res.send(err);
        else if (kq>0){   
            hangxe.remove('id="'+req.params.id+'"',function(err,row){
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
//     hangxe.query("SELECT createid() as id",function(err,row,fields){
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