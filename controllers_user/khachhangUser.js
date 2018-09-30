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
router.post('/addUser', function(req, res){
    if(req.body.SDT_KH && req.body.USERPASSWORD){
        khachhang.find('first', {where:"SDT_KH='"+req.body.SDT_KH+"'"}, function(err, row) {
            if(err)
            res.send(result.error(1,"Database Error !"));
            else
            {
                if(row.SDT_KH)
                res.send({"errorCode":2,"errorMessage":"Số điện thoại này đã đăng kí"});
                else
                {
                khachhang.query("SELECT createMaKhachHang() as MAKHACHHANG",function(err,row,fields){
                        if(err)
                        {
                            res.send(result.error(1,"Database Error !"));
                        } else
                        {
                            khachhang.set('MAKHACHHANG','KH'+row[0].MAKHACHHANG);
                            khachhang.set('SDT_KH',req.body.SDT_KH);
                            khachhang.set('USERPASSWORD',req.body.USERPASSWORD);
                            khachhang.save(function(err, row){
                            if(err){
                            res.send(result.error(1,"Database Error !"));
                            }
                            else
                            {
                                res.send(result.data(khachhang));
                            }
                            });
                        }
                });
              }
            }
        });  
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//cap nhat thong tin khach hang
router.put('/capnhat', function(req, res){
    // console.log(req.body);
      if(req.body.SDT_KH){
        khachhang.find('first', {where: 'SDT_KH="'+req.body.SDT_KH+'"'}, function(err, rowKH) {
              if(err)
              {
                khachhang.send(result.error(1,"Database Error !"));
              } else
              {
                khachhang.set('TENKHACHHANG',req.body.TENKHACHHANG);
                khachhang.set('GIOITINH',req.body.GIOITINH);
                khachhang.set('NGAYSINH',req.body.NGAYSINH);
                khachhang.set('DIACHI_KH',req.body.DIACHI_KH);
                khachhang.set('EMAIL_KH',req.body.EMAIL_KH);
                khachhang.save("MAKHACHHANG='"+rowKH.MAKHACHHANG+"'",function(err, row){
                      if(err){
                          res.send(result.error(1,"Database Error !"));
                      }else {
                          res.send(result.data(khachhang));
                      }
                  });
              }
          });
      }else{
          res.send(result.error(2,"Missing field"));
      }
  });
//doi mat khau moi cho khach hang khi dang nhap
router.put('/doimk', function(req, res){
    console.log(req.body);
      if(req.body.SDT_KH){
        khachhang.find('first', {where: 'SDT_KH="'+req.body.SDT_KH+'"'}, function(err, rowKH) {
              if(err)
              {
                khachhang.send(result.error(1,"Database Error !"));
              } else
              {
                khachhang.set('USERPASSWORD',req.body.USERPASSWORD);    

                khachhang.save("MAKHACHHANG='"+rowKH.MAKHACHHANG+"'",function(err, row){
                      if(err){
                          res.send(result.error(1,"Database Error !"));
                      }else {
                          res.send(result.data(khachhang));
                      }
                  });
              }
          });
      }else{
          res.send(result.error(2,"Missing field"));
      }
});
module.exports =router;