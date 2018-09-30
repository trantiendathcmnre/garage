var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var Xe=Db.extend({tableName:"xe"});
var xe=new Xe();
var KhachHang=Db.extend({tableName:"khachhang"});
var khachhang=new KhachHang();
//lay thong tin danh sach xe theo so dien thoai
router.get('/SDT/:id',function(req,res){
    xe.query("SELECT x.MAXE,x.BIENSOXE from xe x,khachhang kh where x.MAKHACHHANG=kh.MAKHACHHANG and kh.SDT_KH='"+req.params.id+"' and x.TRANGTHAI='1'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//lay tat ca thong tin xe bao gom xe chua phe duyet
router.get('/xe',function(req,res){
    xe.query("SELECT * from xe",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//-------------------------------------------------
//select tat cac cac  xe(thong tin day du)+xe chua phe duyet theo SDT khach hang 
router.get('/macdinh/:id',function(req,res){
    xe.query("SELECT x.MAXE, x.BIENSOXE, kh.SDT_KH, dx.TENDONGXE, dx.MADONGXE, x.SOVIN, x.SOKHUNG, x.SOMAY, x.SO_KILOMET, x.MAUXE,x.TRANGTHAI from xe x,khachhang kh,dongxe dx where x.MAKHACHHANG=kh.MAKHACHHANG and x.MADONGXE = dx.MADONGXE and kh.SDT_KH='"+req.params.id+"'",function(err,rows,fields)
    {
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//thêm xe moi cho khach hang
router.post('/themxe', function(req, res){
    // console.log(req.body);
     if(req.body.SDT_KH && req.body.BIENSOXE){
     xe.query("SELECT createMaXe() as MAXE",function(err,rowXE,fields){
         if(err)
         {
             res.send(result.error(1,"Database Error !"));
         }
         else
         {
             khachhang.find('first', {where: 'SDT_KH="'+req.body.SDT_KH+'"'}, function(err, rowKH) {
                 if(err)
                 {
                     res.send(result.error(1,"Database Error !"));
                 } else
                 {
                     console.log('XE'+rowXE[0].MAXE);
                     xe.set('MAXE','XE'+rowXE[0].MAXE);
                     xe.set('MADONGXE',req.body.MADONGXE);
                     xe.set('BIENSOXE',req.body.BIENSOXE);
                     xe.set('SOVIN',req.body.SOVIN);
                     xe.set('SOKHUNG',req.body.SOKHUNG);
                     xe.set('SOMAY',req.body.SOMAY);
                     xe.set('SO_KILOMET',req.body.SO_KILOMET);
                     xe.set('MAUXE',req.body.MAUXE);
                     xe.set('TRANGTHAI','0');
                     xe.set('MAKHACHHANG',rowKH.MAKHACHHANG);
                     xe.save(function(err, row){
                         if(err){
                             res.send(result.error(1,"Database Error !"));
                         }else {
                             res.send(result.data(xe));
                         }
                     });
                 }
             });
         }
     });
     }else{
         res.send(result.error(2,"Missing field"));
     }
 });
 //cap nhat thong tin xe
 router.put('/capnhat', function(req, res){
    // console.log(req.body);
      if(req.body.BIENSOXE){
          xe.find('first', {where: 'BIENSOXE="'+req.body.BIENSOXE+'"'}, function(err, rowXE) {
              if(err)
              {
                  res.send(result.error(1,"Database Error !"));
              } else
              {
                  xe.set('MADONGXE',req.body.MADONGXE);
                  xe.set('SOVIN',req.body.SOVIN);
                  xe.set('SOKHUNG',req.body.SOKHUNG);
                  xe.set('SOMAY',req.body.SOMAY);
                  xe.set('SO_KILOMET',req.body.SO_KILOMET);
                  xe.set('MAUXE',req.body.MAUXE);
                  
                  xe.save("MAXE='"+rowXE.MAXE+"'",function(err, row){
                      if(err){
                          res.send(result.error(1,"Database Error !"));
                      }else {
                          res.send(result.data(xe));
                      }
                  });
              }
          });
      }else{
          res.send(result.error(2,"Missing field"));
      }
  });
module.exports =router; 