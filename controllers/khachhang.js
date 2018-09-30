var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var KhachHang=Db.extend({tableName:"khachhang"});
var khachhang=new KhachHang();
router.get('/',function(req,res){
    khachhang.find('all',function(err,rows,fields){
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
    khachhang.find('first',{where: "MAKHACHHANG = '"+req.params.id+"'"},function(err,row){
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
    console.log(req.body);
    if(req.body.MAKHACHHANG && req.body.TENKHACHHANG){
        khachhang.set('MAKHACHHANG',req.body.MAKHACHHANG);
        khachhang.set('TENKHACHHANG',req.body.TENKHACHHANG);
        khachhang.set('GIOITINH',req.body.GIOITINH);
        khachhang.set('NGAYSINH',req.body.NGAYSINH);
        khachhang.set('DIACHI_KH',req.body.DIACHI_KH);
        khachhang.set('SDT_KH',req.body.SDT_KH);
        khachhang.set('EMAIL_KH',req.body.EMAIL_KH);
        // khachhang.set('USERPASSWORD','123456');
        khachhang.save(function(err, row){
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
router.get('/taoma/makhachhang',function(req,res){
    khachhang.query("SELECT createMaKhachHang() as MAKHACHHANG",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            console.log(row);
            res.send(result.data(row));
        }
    });
});
router.put('/',function(req,res){
    if(req.body.MAKHACHHANG && req.body.TENKHACHHANG){
        khachhang.set('TENKHACHHANG',req.body.TENKHACHHANG);
        khachhang.set('GIOITINH',req.body.GIOITINH);
        khachhang.set('NGAYSINH',req.body.NGAYSINH);
        khachhang.set('DIACHI_KH',req.body.DIACHI_KH);
        khachhang.set('SDT_KH',req.body.SDT_KH);
        khachhang.set('EMAIL_KH',req.body.EMAIL_KH);
        khachhang.save("MAKHACHHANG='"+req.body.MAKHACHHANG+"'",function(err, row){
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
router.delete('/:id',function(req,res){
    khachhang.find('count',{where :'MAKHACHHANG="'+req.params.id+'"'},function(err,kq){
        if(err)
        res.send(err);
        else if (kq>0){   
            khachhang.remove('MAKHACHHANG="'+req.params.id+'"',function(err,row){
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