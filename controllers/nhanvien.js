var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var NhanVien=Db.extend({tableName:"nhanvien"});
var nhanvien=new NhanVien();
router.use(function(req,res,next){next();});
router.get('/',function(req,res){
    nhanvien.find('all',function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get tat ca nhan vien dang lam viec trong garage
router.get('/hoatdong',function(req,res){
    nhanvien.find('all',{where:"TRANGTHAINV='1'"},function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/donvi/:id',function(req,res){
    nhanvien.find('all',{where: "MADONVI = '"+req.params.id+"' and TRANGTHAINV='1'"},function(err,rows,fields){
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
    nhanvien.find('first',{where: "MANHANVIEN = '"+req.params.id+"'"},function(err,row){
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
    if(req.body.MANHANVIEN && req.body.TENNHANVIEN){
        nhanvien.set('MANHANVIEN',req.body.MANHANVIEN);
        nhanvien.set('TENNHANVIEN',req.body.TENNHANVIEN);
        nhanvien.set('GIOITINHNV',req.body.GIOITINHNV);
        nhanvien.set('NGAYSINHNV',req.body.NGAYSINHNV);
        nhanvien.set('DIACHINV',req.body.DIACHINV);
        nhanvien.set('SDT',req.body.SDT);
        nhanvien.set('EMAIL',req.body.EMAIL);
        nhanvien.set('TRANGTHAINV','1');
        nhanvien.set('MADONVI',req.body.MADONVI);
        nhanvien.save(function(err, row){
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
router.get('/taoma/manhanvien',function(req,res){
    nhanvien.query("SELECT createMaNhanVien() as MANHANVIEN",function(err,row,fields){
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
    if(req.body.MANHANVIEN && req.body.TENNHANVIEN){
        nhanvien.set('TENNHANVIEN',req.body.TENNHANVIEN);
        nhanvien.set('GIOITINHNV',req.body.GIOITINHNV);
        nhanvien.set('NGAYSINHNV',req.body.NGAYSINHNV);
        nhanvien.set('DIACHINV',req.body.DIACHINV);
        nhanvien.set('SDT',req.body.SDT);
        nhanvien.set('EMAIL',req.body.EMAIL);
        nhanvien.set('TRANGTHAINV',req.body.TRANGTHAINV);
        nhanvien.set('MADONVI',req.body.MADONVI);
        nhanvien.save("MANHANVIEN='"+req.body.MANHANVIEN+"'",function(err, row){
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
    nhanvien.find('count',{where :'MANHANVIEN="'+req.params.id+'"'},function(err,kq){
        if(err)
        res.send(err);
        else if (kq>0){   
            khachhang.remove('MANHANVIEN="'+req.params.id+'"',function(err,row){
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