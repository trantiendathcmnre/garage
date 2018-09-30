var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var moment = require('../node_modules/moment');
var DonHang=Db.extend({tableName:"donhang"});
var donhang=new DonHang();

var Chitiet_pt_dh=Db.extend({tableName:"chitiet_pt_dh"});
var chitiet_pt_dh=new Chitiet_pt_dh();

var Chitiet_dh_cong=Db.extend({tableName:"chitiet_dh_cong"});
var chitiet_dh_cong=new Chitiet_dh_cong();

var PhieuKiemTra=Db.extend({tableName:"phieukiemtra"});
var phieukiemtra=new PhieuKiemTra();

var Chitiet_dh_nv=Db.extend({tableName:"chitiet_dh_nv"});
var chitiet_dh_nv=new Chitiet_dh_nv();

var Chitiet_thanhtoan=Db.extend({tableName:"chitiet_thanhtoan"});
var chitiet_thanhtoan=new Chitiet_thanhtoan();

router.get('/',function(req,res){
    donhang.query("SELECT * from dongxe dx,xe x,phieukiemtra pkt,donhang dh where dx.MADONGXE=x.MADONGXE and pkt.MAXE=x.MAXE and pkt.ID_PHIEUKHAM=dh.ID_PHIEUKHAM and dh.TRANGTHAI_DH IN('1','2','0')",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/dangsua',function(req,res){
    donhang.query("SELECT * from dongxe dx,xe x,phieukiemtra pkt,donhang dh where dx.MADONGXE=x.MADONGXE and pkt.MAXE=x.MAXE and pkt.ID_PHIEUKHAM=dh.ID_PHIEUKHAM and dh.TRANGTHAI_DH='3'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get don hang hoan thanh
router.get('/hoanthanh',function(req,res){
    donhang.query("SELECT * from dongxe dx,xe x,phieukiemtra pkt,donhang dh where dx.MADONGXE=x.MADONGXE and pkt.MAXE=x.MAXE and pkt.ID_PHIEUKHAM=dh.ID_PHIEUKHAM and dh.TRANGTHAI_DH='4'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get don hang theo bien so xe
router.get('/hoanthanh/biensoxe/:id',function(req,res){
    donhang.query("SELECT * from dongxe dx,xe x,phieukiemtra pkt,donhang dh where dx.MADONGXE=x.MADONGXE and pkt.MAXE=x.MAXE and pkt.ID_PHIEUKHAM=dh.ID_PHIEUKHAM and dh.TRANGTHAI_DH='4' and x.MAXE='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get nhan vien - don hang
router.get('/nhanvien/:id',function(req,res){
    donhang.query("SELECT nv.MANHANVIEN,nv.TENNHANVIEN,dv.TENDONVI,ct.TRANGTHAICV from donhang dh,donvilamviec dv,nhanvien nv,chitiet_dh_nv ct where dh.MADONHANG=ct.MADONHANG and dv.MADONVI=nv.MADONVI and nv.MANHANVIEN=ct.MANHANVIEN and dh.MADONHANG='"+req.params.id+"'",function(err,rows,fields){
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
    donhang.find('first',{where: "MADONHANG = '"+req.params.id+"'"},function(err,row){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row));
        }
    });
});
router.get('/taoma/madonhang',function(req,res){
    donhang.query("SELECT createMaDonHang() as MADONHANG",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row));
        }
    });
});
router.get('/donhang/phutung/:id',function(req,res){
    donhang.query("SELECT * from donhang dh,chitiet_pt_dh ct,phutung pt,donvitinh dvt where pt.ID_DVT=dvt.ID_DVT and dh.MADONHANG=ct.MADONHANG and pt.MAPHUTUNG=ct.MAPHUTUNG and dh.MADONHANG='"+req.params.id+"'",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row));
        }
    });
});
router.get('/donhang/cong/:id',function(req,res){
    donhang.query("SELECT * from donhang dh,chitiet_dh_cong ct,baogiacong bgc where bgc.MABAOGIACONG=ct.MABAOGIACONG and dh.MADONHANG=ct.MADONHANG and dh.MADONHANG='"+req.params.id+"'",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row));
        }
    });
});
//luu don hang
router.post('/', function(req, res){
    console.log(req.body.dataCong);
    if(req.body.MADONHANG && req.body.ID_PHIEUKHAM){
        tongtienPT=0;
        tongtienCong=0;
        for(let i of req.body.dataPhuTung){
            tongtienPT+=i.SL*i.DONGIA;
        }
        for(let j of req.body.dataCong){
            tongtienCong+=j.SOLUONGCONG*j.DONGIA;
        }
        donhang.set('MADONHANG',req.body.MADONHANG);
        donhang.set('NGAYLAPDH',req.body.NGAYLAPDH);
        donhang.set('ID_PHIEUKHAM',req.body.ID_PHIEUKHAM);
        donhang.set('TIENPHUTUNG',tongtienPT);
        donhang.set('TIENNHANCONG',tongtienCong);
        donhang.set('THANHTOAN',0);
        donhang.set('GHICHU_DH',req.body.GHICHU_DH);
        donhang.set('GIAMGIA',req.body.GIAMGIA);
        donhang.set('TONGTIEN',parseInt(tongtienPT)+parseInt(tongtienCong));
        donhang.set('TRANGTHAI_DH','1');//cho phe duyet
        donhang.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                //Cap nhat phieu kham 
                phieukiemtra.set('TRANGTHAIPK','2');
                phieukiemtra.save("ID_PHIEUKHAM="+req.body.ID_PHIEUKHAM,function(err, row){
                if(err){
                res.send(result.error(1,"Database Error !"));
                }
                })
                //Luu chi tiet phu tung-don hang
                for(let i of req.body.dataPhuTung){
                    chitiet_pt_dh.set('MADONHANG',req.body.MADONHANG);
                    chitiet_pt_dh.set('MAPHUTUNG',i.MAPHUTUNG);
                    chitiet_pt_dh.set('SOLUONGTAMLUU',i.SL);
                    chitiet_pt_dh.set('DONGIA',i.DONGIA);
                    chitiet_pt_dh.save(function(err, row){
                        if(err)
                        {
                            res.send(result.error(1,"Database Error !"));
                        }
                    })

                }
                //Luu chi tiet cong
                for(let i of req.body.dataCong){
                    chitiet_dh_cong.set('MADONHANG',req.body.MADONHANG);
                    chitiet_dh_cong.set('MABAOGIACONG',i.MABAOGIACONG);
                    chitiet_dh_cong.set('SOLUONGTAMLUU',i.SOLUONGCONG);
                    chitiet_dh_cong.set('THANHTIENCONG',i.SOLUONGCONG*i.DONGIA);
                    chitiet_dh_cong.save(function(err, row){
                        if(err)
                        {
                            res.send(result.error(1,"Database Error !"));
                        }
                    })

                }
                res.send(result.data(row));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
})
//luu nhan vien sua chua xe
router.put('/nhanvien', function(req, res){
    if(req.body.MADONHANG)
    {
        chitiet_dh_nv.query("DELETE from chitiet_dh_nv where MADONHANG='"+req.body.MADONHANG+"'",function(err,row,fields){
            if(err)
            {
                res.send(result.error(1,"Database Error !"));
            }
            else
            {
                var MADONHANG=req.body.MADONHANG;
                donhang.set("TRANGTHAI_DH",'3');
                donhang.save("MADONHANG='"+req.body.MADONHANG+"'",function(err, row){
                    if(err){
                        res.send(result.error(1,"Database Error !"));
                        return;
                    }
                    else
                    {
                        for(let i of req.body.dataNV)
                {
                    chitiet_dh_nv.set("MADONHANG",MADONHANG);
                    chitiet_dh_nv.set("MANHANVIEN",i.MANHANVIEN);
                    chitiet_dh_nv.set("TRANGTHAICV",i.TRANGTHAICV);
                    chitiet_dh_nv.save(function(err, row){
                        if(err)
                        {
                            res.send(result.error(1,"Database Error !"));
                            return;
                        }
                    })
                }
                    }
                });
               
            res.send(result.data(row));
            }
        });
    }
})
//put xac nhan don hang de chuyen qua sua chua
router.put('/', function(req, res){
    if(req.body.MADONHANG){
        tongtienPT=0;
        tongtienCong=0;
        for(let i of req.body.dataPhuTung){
            tongtienPT+=(parseInt(i.SL)+parseInt(i.SLXN))*parseInt(i.DONGIA);
            console.log(tongtienPT);
        }
        for(let j of req.body.dataCong){
            tongtienCong+=(parseInt(j.SLXN)+parseInt(j.SOLUONGCONG))*parseInt(j.DONGIA);
        }
        donhang.set('TIENPHUTUNG',tongtienPT);
        donhang.set('TIENNHANCONG',tongtienCong);
        donhang.set('GHICHU_DH',req.body.GHICHU_DH);
        donhang.set('GIAMGIA',req.body.GIAMGIA);
        donhang.set('TONGTIEN',parseInt(tongtienPT)+parseInt(tongtienCong));
        donhang.set('TRANGTHAI_DH',req.body.TRANGTHAI_DH);//phe duyet
        donhang.save("MADONHANG='"+req.body.MADONHANG+"'",function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                //Luu chi tiet phu tung-don hang
                chitiet_pt_dh.query("DELETE from chitiet_pt_dh where MADONHANG='"+req.body.MADONHANG+"'",function(err,row,fields){
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    }
                    else
                    {
                        for(let i of req.body.dataPhuTung){ 
                            //luu moi
                            chitiet_pt_dh.set('MADONHANG',req.body.MADONHANG);
                            chitiet_pt_dh.set('MAPHUTUNG',i.MAPHUTUNG);
                            chitiet_pt_dh.set('SOLUONGXACNHAN',(parseInt(i.SL)+parseInt(i.SLXN)));
                            chitiet_pt_dh.set('SOLUONGTAMLUU',0);
                            chitiet_pt_dh.set('DONGIA',i.DONGIA);
                            chitiet_pt_dh.save(function(err, row){
                                if(err)
                                {
                                    res.send(result.error(1,"Database Error !"));
                                    return;
                                }
                                else
                                {
                                  
                                }
                            })
                        }
                    }
                });
                //Luu chi tiet cong
                
                chitiet_dh_cong.query("DELETE from chitiet_dh_cong where MADONHANG='"+req.body.MADONHANG+"'",function(err,row,fields){
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    }
                    else
                    {
                        for(let i of req.body.dataCong){
                            chitiet_dh_cong.set('MADONHANG',req.body.MADONHANG);
                            chitiet_dh_cong.set('MABAOGIACONG',i.MABAOGIACONG);
                            chitiet_dh_cong.set('SOLUONGXACNHAN',( parseInt(i.SOLUONGCONG)+parseInt(i.SLXN)));
                            chitiet_dh_cong.set('SOLUONGTAMLUU',0);
                            chitiet_dh_cong.set('THANHTIENCONG',parseInt (i.SOLUONGCONG)* parseInt(i.DONGIA));
                            chitiet_dh_cong.save(function(err, row){
                                if(err)
                                {
                                    res.send(result.error(1,"Database Error !"));
                                }
                            })
                        }
                    }
                });
                res.send(result.data(row));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//luu tam don hang
router.put('/luutam', function(req, res){
    if(req.body.MADONHANG){
        donhang.set('GHICHU_DH',req.body.GHICHU_DH);
        donhang.save("MADONHANG='"+req.body.MADONHANG+"'",function(err, row){
            if(err)
            {
                res.send(result.error(1,"Database Error !"));
            }
            else
            {
              //luu tam chi tiet don hang
              chitiet_pt_dh.query("DELETE from chitiet_pt_dh where MADONHANG='"+req.body.MADONHANG+"'",function(err,row,fields){
                if(err)
                {
                    res.send(result.error(1,"Database Error !"));
                }
                else
                {
                    for(let i of req.body.dataPhuTung){ 
                        //luu moi
                     
                                    chitiet_pt_dh.set('MADONHANG',req.body.MADONHANG);
                                    chitiet_pt_dh.set('MAPHUTUNG',i.MAPHUTUNG);
                                    chitiet_pt_dh.set('SOLUONGTAMLUU',i.SL);
                                    chitiet_pt_dh.set('SOLUONGXACNHAN',i.SLXN);
                                    chitiet_pt_dh.set('DONGIA',i.DONGIA);
                                    chitiet_pt_dh.save(function(err, row){
                                    if(err)
                                    {
                                     res.send(result.error(1,"Database Error !"));
                                      return;
                                    }
                                     else
                                    {  }
                                    });
                    }
                } 
            });
              //luu tam chi tiet cong 
              chitiet_dh_cong.query("DELETE from chitiet_dh_cong where MADONHANG='"+req.body.MADONHANG+"'",function(err,row,fields){
                if(err)
                {
                    res.send(result.error(1,"Database Error !"));
                }
                else
                {
                    for(let i of req.body.dataCong){
                        chitiet_dh_cong.set('MADONHANG',req.body.MADONHANG);
                        chitiet_dh_cong.set('MABAOGIACONG',i.MABAOGIACONG);
                        chitiet_dh_cong.set('SOLUONGXACNHAN',i.SLXN);
                        chitiet_dh_cong.set('SOLUONGTAMLUU',i.SOLUONGCONG);
                        chitiet_dh_cong.set('THANHTIENCONG',i.SOLUONGCONG*i.DONGIA);
                        chitiet_dh_cong.save(function(err, row){
                            if(err)
                            {
                                res.send(result.error(1,"Database Error !"));
                            }
                        })
                    }
                }
            }); 
            }
        });
        res.send(result.error(0,''));
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//-----------------
router.post('/donhang/xacnhan', function(req, res){
    console.log(req.body);
    var TRANGTHAI_DH=req.body.TRANGTHAI_DH;
    donhang.set('TRANGTHAI_DH',req.body.TRANGTHAI_DH);
    donhang.save("MADONHANG='"+req.body.MADONHANG+"'",function(err,row){
        if(err){
            res.send(result.error(1,"Database Error !"));
        }else {
            if(TRANGTHAI_DH=='4')
            {
                console.log('hoanthanh');
                chitiet_dh_nv.query("UPDATE chitiet_dh_nv set TRANGTHAICV='1' WHERE MADONHANG='"+req.body.MADONHANG+"'",function(err,rows,fields){
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    } 
                });
            }
            res.send(result.data(row));

        }
   });
});
//lay hey nhung nhan vien dang lam viec-khong the phan nhiem vu tiep theo
router.get('/donhang/nhanvien/danglamviec',function(req,res){
    chitiet_dh_nv.query("SELECT * from chitiet_dh_nv ct WHERE ct.TRANGTHAICV='0'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/khachhang/:id',function(req,res){
    console.log(req.params.id);
    donhang.query("SELECT * from xe x,phieukiemtra pkt,donhang dh where x.MAXE=pkt.MAXE and pkt.ID_PHIEUKHAM=dh.ID_PHIEUKHAM and x.MAKHACHHANG='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get thong tin cong no
router.get('/congnokh/:id',function(req,res){
    console.log(req.params.id);
    chitiet_thanhtoan.find('all',{where: "MADONHANG='"+req.params.id+"'"},function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//cong no khach hang
router.post('/congnokh', function(req, res){
    console.log(req.body);
    if(req.body.MADONHANG && req.body.TIENTHANHTOAN){
        chitiet_thanhtoan.set('MADONHANG',req.body.MADONHANG);
        chitiet_thanhtoan.set('NGAYTHANHTOAN',req.body.NGAYTHANHTOAN);
        chitiet_thanhtoan.set('NGUOITHANHTOAN',req.body.NGUOITHANHTOAN);
        chitiet_thanhtoan.set('TIENTHANHTOAN',req.body.TIENTHANHTOAN);
        chitiet_thanhtoan.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                donhang.find('first', {where: "MADONHANG='"+req.body.MADONHANG+"'"}, function(err, rowDH) {
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    }
                    else
                    {
                        console.log(parseInt(rowDH.THANHTOAN)+parseInt(req.body.TIENTHANHTOAN));
                        donhang.set('THANHTOAN',parseInt(rowDH.THANHTOAN)+parseInt(req.body.TIENTHANHTOAN));//phe duyet
                        donhang.save("MADONHANG='"+req.body.MADONHANG+"'",function(err, rowU){
                            if(err)
                            {
                                res.send(result.error(1,"Database Error !"));
                            }
                            else
                            {
                                chitiet_thanhtoan.find('count', {where: "MADONHANG='"+req.body.MADONHANG+"'"}, function(err,kqTT) {
                                   if(err)
                                   {
                                    res.send(result.error(1,"Database Error !"));
                                   }
                                   else
                                   {
                                       //thanh toan lan 1 ,cap nhat bao hanh
                                        if(kqTT==1)
                                        {
                                            donhang.query("SELECT ct.MAPHUTUNG,pt.THOIGIANBAOHANH from chitiet_pt_dh ct,phutung pt where ct.MAPHUTUNG=pt.MAPHUTUNG and ct.MADONHANG='"+req.body.MADONHANG+"'",function(err,row,fields){
                                                if(err)
                                                {
                                                    res.send(result.error(1,"Database Error !"));
                                                } else
                                                {
                                                    var dem=0;
                                                    for (let i of row)
                                                    {
                                                        dem=dem+1;
                                                        var d=new Date();
                                                        var kq=add_months(d,i.THOIGIANBAOHANH);
                                                        var HANBAOHANH=(moment(kq).format('YYYY-MM-DD'));
                                                        chitiet_pt_dh.query("UPDATE chitiet_pt_dh set HANBAOHANH='"+HANBAOHANH+"' WHERE MADONHANG='"+req.body.MADONHANG+"' and MAPHUTUNG='"+i.MAPHUTUNG+"'" ,function(err,rowCN,fields){
                                                            if(err){
                                                            }
                                                            else{
                                                            }
                                                        });
                                                    }
                                                    if(dem==row.length)
                                                    res.send(result.data(rowU));
                                                }
                                            }); 
                                        }
                                        else
                                        res.send(result.data(rowU));
                                   }
                            });
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
//Cap nhat bao hanh cho phu tung trong don hang
router.post('/capnhatbaohanh', function(req, res){
    donhang.query("SELECT ct.MAPHUTUNG,pt.THOIGIANBAOHANH from chitiet_pt_dh ct,phutung pt where ct.MAPHUTUNG=pt.MAPHUTUNG and ct.MADONHANG='"+req.body.MADONHANG+"'",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            var dem=0;
            for (let i of row)
            {
                dem=dem+1;
                var d=new Date();
                var kq=add_months(d,i.THOIGIANBAOHANH);
                var HANBAOHANH=(moment(kq).format('YYYY-MM-DD'));
                chitiet_pt_dh.query("UPDATE chitiet_pt_dh set HANBAOHANH='"+HANBAOHANH+"' WHERE MADONHANG='"+req.body.MADONHANG+"' and MAPHUTUNG='"+i.MAPHUTUNG+"'" ,function(err,rowCN,fields){
                    if(err)
                    {

                    }
                    else
                    {

                    }
                });
            }
            if(dem==row.length)
            res.send(result.data(row));
        }
    });
});
function  add_months(dt, n) 
{
  return new Date(dt.setMonth(dt.getMonth() + n));      
}
//get thong tin khách hàng theo biển số xe
router.get('/biensoxe/:id', function(req, res){
    donhang.query("SELECT * from khachhang kh,xe x WHERE kh.MAKHACHHANG=x.MAKHACHHANG and x.BIENSOXE='"+req.params.id+"'",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }
        else
        res.send(result.data(row[0]));
    });
});
//cap nhat phieu hen
router.post('/capnhat/phieuhen', function(req, res){
    console.log(res.body);
    donhang.set('THOIGIANHEN',req.body.THOIGIANHEN);
    donhang.save("MADONHANG='"+req.body.MADONHANG+"'",function(err,row){
        if(err){
            res.send(result.error(1,"Database Error !"));
        }else {
            res.send(result.data(row));
        }

    });
});
module.exports =router;