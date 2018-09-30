var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var Xe=Db.extend({tableName:"xe"});
var xe=new Xe();
var DonHang=Db.extend({tableName:"donhang"});
var donhang=new DonHang();
router.get('/',function(req,res){
    xe.query("SELECT * from xe x,dongxe dx,hangxe hx where dx.MAHANGXE=hx.MAHANGXE and x.MADONGXE=dx.MADONGXE",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get xe theo trang thai xe
router.get('/trangthai/:id',function(req,res){
    xe.query("SELECT * from khachhang kh,xe x,dongxe dx,hangxe hx where dx.MAHANGXE=hx.MAHANGXE and x.MADONGXE=dx.MADONGXE and kh.MAKHACHHANG=x.MAKHACHHANG and x.TRANGTHAI='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/makhachhang/:id',function(req,res){
    xe.query("SELECT * from xe x,dongxe dx,hangxe hx where dx.MAHANGXE=hx.MAHANGXE and x.MADONGXE=dx.MADONGXE and x.MAKHACHHANG='"+req.params.id+"'",function(err,rows,fields){
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
    xe.find('first',{where: "MAXE = '"+req.params.id+"'"},function(err,row){
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
    console.log('Luu xe');
    if(req.body.MAXE && req.body.BIENSOXE){
        xe.set('MAXE',req.body.MAXE);
        xe.set('MADONGXE',req.body.MADONGXE);
        xe.set('BIENSOXE',req.body.BIENSOXE);
        xe.set('SOVIN',req.body.SOVIN);
        xe.set('SOKHUNG',req.body.SOKHUNG);
        xe.set('SOMAY',req.body.SOMAY);
        xe.set('SO_KILOMET',req.body.SO_KILOMET);
        xe.set('MAUXE',req.body.MAUXE);
        xe.set('TRANGTHAI','1');
        xe.set('MAKHACHHANG',req.body.MAKHACHHANG);
        xe.save(function(err, row){
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
router.get('/taoma/maxe',function(req,res){
    xe.query("SELECT createMaXe() as MAXE",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row));
        }
    });
});
router.put('/', function(req, res){
    console.log(req.body);
    if(req.body.MAXE && req.body.BIENSOXE){
        xe.set('MADONGXE',req.body.MADONGXE);
        xe.set('BIENSOXE',req.body.BIENSOXE);
        xe.set('SOVIN',req.body.SOVIN);
        xe.set('SOKHUNG',req.body.SOKHUNG);
        xe.set('SOMAY',req.body.SOMAY);
        xe.set('SO_KILOMET',req.body.SO_KILOMET);
        xe.set('MAUXE',req.body.MAUXE);
        xe.set('MAKHACHHANG',req.body.MAKHACHHANG);
        xe.save("MAXE='"+req.body.MAXE+"'",function(err, row){
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
//xac nhan them xe cho khach hang
router.post('/xacnhanxe', function(req, res){
    console.log(req.body);
    if(req.body.MAXE){
        xe.set('TRANGTHAI','1');
        xe.save("MAXE='"+req.body.MAXE+"'",function(err, row){
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
//get so dien thoai cua khach hang theo xe
router.get('/SDT_KH/:id',function(req,res){
    console.log(req.params.id);
    xe.query("SELECT kh.SDT_KH,x.BIENSOXE from khachhang kh,xe x where kh.MAKHACHHANG=x.MAKHACHHANG and x.MAXE='"+req.params.id+"'",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row[0]));
        }
    });
});
//get cac xe dang sua chua de cho vao kho sua
router.get('/dsxe/dangsua',function(req,res){
    donhang.query("SELECT * from dongxe dx,xe x,phieukiemtra pkt,donhang dh where dx.MADONGXE=x.MADONGXE and pkt.MAXE=x.MAXE and pkt.ID_PHIEUKHAM=dh.ID_PHIEUKHAM and dh.TRANGTHAI_DH IN ('2','3')",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
module.exports =router;