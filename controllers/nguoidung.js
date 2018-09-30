var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');

var Users=Db.extend({tableName:"users"});
var users=new Users();

var Detail_group_user=Db.extend({tableName:"detail_group_user"});
var detail_group_user=new Detail_group_user();

router.get('/',function(req,res){
    users.find('all',function(err,rows,fields){
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
    users.find('first',{where: "USE_ID ="+req.params.id},function(err,row){
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
    if(req.body.ACCOUNT){
        users.set('ACCOUNT',req.body.ACCOUNT);
        users.set('FULLNAME',req.body.FULLNAME);
        users.set('PHONE',req.body.PHONE);
        users.set('EMAIL',req.body.EMAIL);
        users.set('PASSWORD','123');
        users.set('STATUS','1');
        users.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(users));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//phan nguoi dung vao nhom
router.post('/phannguoidungvaonhom', function(req, res){
    console.log(req.body);
    if(req.body){
        detail_group_user.query("DELETE from detail_group_user where USE_ID="+req.body.USE_ID,function(err,row,fields){
            if(err)
            {
                res.send(result.error(1,"Database Error !"));
            }
            else
            {
                let dem=0;
                for(let i of req.body.data)
                {
                    detail_group_user.set('ID_GROUP',i.ID_GROUP);
                    detail_group_user.set('USE_ID',req.body.USE_ID);
                    detail_group_user.save(function(err, row){
                    if(err){
                        res.send(result.error(1,"Database Error !"));
                    }else {
                        
                    }
                    });
                    dem++;
                }
                if(dem==req.body.data.length)
                res.send(result.data(detail_group_user));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//get thong tin nguoi dung theo account
router.get('/thongtin/:id',function(req,res){
    users.find('first',{where: "ACCOUNT ='"+req.params.id+"'"},function(err,row){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row));
        }
    });
});
module.exports =router;