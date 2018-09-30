var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var User=Db.extend({tableName:"users"});
var user=new User();

var Detail_group_user=Db.extend({tableName:"detail_group_user"});
var detail_group_user=new Detail_group_user();

var Roles=Db.extend({tableName:"roles"});
var roles=new Roles();

var Menu=Db.extend({tableName:"menu"});
var menu=new Menu();

const uuidv4 = require('uuid/v4');
router.post('/',function(req,res){
    if(req.body.ACCOUNT&& req.body.PASSWORD)
    {
    user.find('first',{where: "ACCOUNT ='"+req.body.ACCOUNT+"' and PASSWORD='"+req.body.PASSWORD+"'"},function(err,row){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            if(row.ACCOUNT)
            {
                var timeout=new Date();
                var datasend={"userId":row.USE_ID,
                            "account":row.ACCOUNT,
                            "fullName":row.FULLNAME,
                            "accessToken":''
                    };
               if( row.EXPIREDTIME>timeout)
                {
                    //con su dung duoc
                    if(row.TOKEN)
                    {
                        //update lai thoi gentime
                        var token=row.TOKEN;
                        user.set("EXPIREDTIME",new Date(timeout.getTime() + 30*60000));
                        user.save("USE_ID="+row.USE_ID,function(err,row){
                            if(err)
                            res.send(result.error(1,"Database Error !"));
                            else
                            {
                            datasend.accessToken=token;
                            res.send(result.data(datasend));
                            }
                        });
                    }
                    else
                    {
                        //tai khoan moi chua co token
                        var token=uuidv4();
                        user.set("TOKEN",token);
                        user.set("EXPIREDTIME",new Date(timeout.getTime() + 30*60000));
                        user.save("USE_ID="+row.USE_ID,function(err,row){
                            if(err)
                            res.send(result.error(1,"Database Error !"));
                            else
                            {
                            datasend.accessToken=token;
                            res.send(result.data(datasend));
                            }
                        });
                    }
                }
                else
                {
                    //timeout
                    console.log('token da het han');
                    var token=uuidv4();
                        user.set("TOKEN",token);
                        user.set("EXPIREDTIME",new Date(timeout.getTime() + 30*60000));
                        user.save("USE_ID="+row.USE_ID,function(err,row){
                            if(err)
                            res.send(result.error(1,"Database Error !"));
                            else
                            {
                            datasend.accessToken=token;
                            res.send(result.data(datasend));
                            }
                    });
                }
            }
            else
            {
                //sai tai khoan
                res.send({"errorCode":1,errorMessage:'Wrong User name or Password'});
            }
        }
    });
    }
    else
    {
        res.send({"errorCode":1,errorMessage:'Missing User name or Password'});
    }
});
//get nhóm quyen cua nguoi dung
router.get('/nhomquyen/:id',function(req,res){
    console.log('ok');
    detail_group_user.find('all',{where:"USE_ID="+req.params.id},function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.post('/dsquyen',function(req,res){
    var quyen=[];
    if(req.body.dsnhom.length==0)
    {
        menu.find('all',{fields: ['ID_MENU']},function(err,rows,fields){
            if(err)
            {
                res.send(result.error(1,"Database Error !"));
            }
            else
            {
                for(let i of rows)
                {
                    quyen.push({"ID_MENU":i.ID_MENU,"ISROLE":0});
                }
                res.send(result.data(quyen));

            }
        });
    }
    else
    {
        menu.find('count', function(err, kq) {
            if(err)
            {
                res.send(result.error(1,"Database Error !"));
            }
            else
            {
    
                var dem=req.body.dsnhom.length*kq;
                var dem1=0;
                for(let i of req.body.dsnhom)
                {
                    roles.find('all',{where:"ID_GROUP="+i.ID_GROUP},function(err,rows,fields){
                        if(err)
                        {
                            res.send(result.error(1,"Database Error !"));
                        }
                        else
                        {
                            for(let j of rows)
                            {
                                dem1=dem1+1;
                                quyen.push({"ID_MENU":j.ID_MENU,"ISROLE":j.ISROLE});
                                if(dem1==dem)
                                {
                                    for(x=0;x<quyen.length-1;x++)
                                    for(y=x+1;y<quyen.length;y++)
                                    {
                                        if(quyen[x].ID_MENU==quyen[y].ID_MENU)
                                        {
                                            if(quyen[x].ISROLE==1 || quyen[y].ISROLE==1)
                                            {
                                                quyen[x].ISROLE=1;
                                                quyen.splice(y,1);
                                            }
                                        }
                                    }
                                    res.send(result.data(quyen));
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
