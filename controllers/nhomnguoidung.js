var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var Group_users=Db.extend({tableName:"group_users"});
var group_users=new Group_users();

var Menu=Db.extend({tableName:"menu"});
var menu=new Menu();

var Roles=Db.extend({tableName:"roles"});
var roles=new Roles();

router.get('/',function(req,res){
    group_users.find('all',function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get danh muc menu
router.get('/menu',function(req,res){
    menu.find('all',function(err,rows,fields){
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
    group_users.find('first',{where: "ID_GROUP ="+req.params.id},function(err,row){
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
    if(req.body.GROUP_NAME){
        group_users.set('GROUP_NAME',req.body.GROUP_NAME);
        group_users.set('GROUP_DESCRIBE',req.body.GROUP_DESCRIBE);
        group_users.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                res.send(result.data(group_users));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//cap nhat quyen cho nhom nguoi dung
router.post('/capnhatquyen', function(req, res){
    if(req.body.ID_MENUS.length==0)
    {
        //cap nhat roles =0 theo ma nhom quyen
        roles.query("DELETE from roles where ID_GROUP="+req.body.ID_GROUP,function(err,row,fields){
            if(err)
            {
                res.send(result.error(1,"Database Error !"));
            }
            else
            {
                menu.find('all',function(err,rowMenu,fields){
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    } else
                    {
                        let dem=0;
                       for(let i of rowMenu)
                       {
                            roles.set('ID_GROUP',req.body.ID_GROUP);
                            roles.set('ID_MENU',i.ID_MENU);
                            roles.set('ISROLE',0);
                            roles.save(function(err, row){
                                if(err){
                                    res.send(result.error(1,"Database Error !"));
                                }else {
                                
                               }
                           });
                           dem++;
                       }
                       if(dem==rowMenu.length)
                       res.send(result.data(roles));
                    }
                });
            }
        });
    }
    else
    {
        //co danh sach menu 
        //xoa ds cu
        roles.query("DELETE from roles where ID_GROUP="+req.body.ID_GROUP,function(err,row,fields){
            if(err)
            {
                res.send(result.error(1,"Database Error !"));
            }
            else
            {
                //duyen menu moi va cap nhat lai
                menu.find('all',function(err,rowMenu,fields){
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    } else
                    {
                        let dem=0;
                        for(let i of rowMenu)
                        {
                            let ISROLE=0;
                            let vt = req.body.ID_MENUS.indexOf(i.ID_MENU);
                            if(vt!=-1)
                            {
                                ISROLE=1;
                            }
                            roles.set('ID_GROUP',req.body.ID_GROUP);
                            roles.set('ID_MENU',i.ID_MENU);
                            roles.set('ISROLE',ISROLE);
                            roles.save(function(err, row){
                                if(err){
                                    res.send(result.error(1,"Database Error !"));
                                }else {
                                
                               }
                           });
                           dem++;
                        }
                        if(dem==rowMenu.length)
                        res.send(result.data(roles));
                    }
                });
            }
        });
    }
});
//get danh sach quyen theo nhom
router.get('/danhsachmenu/:id',function(req,res){
    roles.find('all',{where: "ID_GROUP="+req.params.id},function(err,row){
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