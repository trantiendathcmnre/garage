var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var dateFormat = require('dateformat');
var result=require('../modules/response-result');

var PhieuNhap=Db.extend({tableName:"phieunhap"});
var phieunhap=new PhieuNhap();

var DonHang=Db.extend({tableName:"donhang"});
var donhang=new DonHang();

var PhuTung=Db.extend({tableName:"phutung"});
var phutung=new PhuTung();
var Phieuxuat_suachua=Db.extend({tableName:"phieuxuat_suachua"});
var phieuxuat_suachua=new Phieuxuat_suachua();

router.post('/nhapkho', function(req, res){
    var que='SELECT pn.NGAYLAPPN,pn.MAPHIEUNHAP,pt.MAPHUTUNG,pt.TENPHUTUNG,ct.SOLUONGNHAP,ct.DONGIANHAP,pn.TONGTIEN,pn.TIENTHANHTOAN_PN,pn.TIENNO,dvt.TENDVT from  phieunhap pn,donvitinh dvt,chitiet_pn_pt ct,phutung pt WHERE pt.ID_DVT=dvt.ID_DVT and pn.MAPHIEUNHAP=ct.MAPHIEUNHAP and pt.MAPHUTUNG=ct.MAPHUTUNG and pn.TRANGTHAIPN IN("2","3") and pn.NGAYLAPPN BETWEEN "'+req.body.NGAY_BD+'" and "'+req.body.NGAY_KT+'" and pt.ID_NCC='+req.body.ID_NCC;
    if(req.body.ID_NCC)
    phieunhap.query(que,function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(rows));
        }
    });
    else
    res.send(result.error(2,"Missing field"));
});
router.post('/nhapkho/tongtien', function(req, res){
    var que='SELECT DISTINCT pn.MAPHIEUNHAP,pn.TONGTIEN,pn.TIENTHANHTOAN_PN,pn.TIENNO from phieunhap pn,chitiet_pn_pt ct,phutung pt WHERE pn.MAPHIEUNHAP=ct.MAPHIEUNHAP and pt.MAPHUTUNG=ct.MAPHUTUNG and pn.TRANGTHAIPN IN("2","3") and pn.NGAYLAPPN BETWEEN "'+req.body.NGAY_BD+'" and "'+req.body.NGAY_KT+'" and pt.ID_NCC='+req.body.ID_NCC;
    console.log(que);
    if(req.body.ID_NCC)
    phieunhap.query(que,function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            let data={"TONGTIEN":'',"TIENTHANHTOAN_PN":'',"TIENNO":''};
            let tongtien=0;
            let tienthanhtoan=0;
            let tienno=0;
            for(let i of rows)
            {
                tongtien+=i.TONGTIEN;
                tienthanhtoan+=i.TIENTHANHTOAN_PN;
                tienno+=i.TIENNO;
            }
            data.TONGTIEN=tongtien;
            data.TIENTHANHTOAN_PN=tienthanhtoan;
            data.TIENNO=tienno;
            res.send(result.data(data));
        }
    });
    else
    res.send(result.error(2,"Missing field"));
});
//thong ke xuat kho sua chua
router.post('/xuatkhosuachua', function(req, res){
    var que='SELECT pn.NGAYLAPPN,pn.MAPHIEUNHAP,pt.MAPHUTUNG,pt.TENPHUTUNG,ct.SOLUONGNHAP,ct.DONGIANHAP,pn.TONGTIEN,pn.TIENTHANHTOAN_PN,pn.TIENNO,dvt.TENDVT from  phieunhap pn,donvitinh dvt,chitiet_pn_pt ct,phutung pt WHERE pt.ID_DVT=dvt.ID_DVT and pn.MAPHIEUNHAP=ct.MAPHIEUNHAP and pt.MAPHUTUNG=ct.MAPHUTUNG and pn.TRANGTHAIPN IN("2","3") and pn.NGAYLAPPN BETWEEN "'+req.body.NGAY_BD+'" and "'+req.body.NGAY_KT+'" and pt.ID_NCC='+req.body.ID_NCC;
    if(req.body.ID_NCC)
    phieunhap.query(que,function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(rows));
        }
    });
    else
    res.send(result.error(2,"Missing field"));
});
//tinh tong doanh thu
router.get('/tongdoanhthu',function(req,res){
    donhang.query("SELECT SUM(dh.THANHTOAN) AS TONGDOANHTHU FROM donhang dh WHERE dh.TRANGTHAI_DH=4",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows[0]));
        }
    });
}); 
//tinh tong cong no
router.get('/tongtienno',function(req,res){
    donhang.query(" SELECT SUM(pn.TIENNO) AS TIENNO FROM phieunhap pn WHERE pn.TRANGTHAIPN IN ('2','3') ",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows[0]));
        }
    });
}); 
//thong ke xuat-nhap-ton kho cua phu tung
router.get('/thongketonkho',function(req,res){
    //tong xuat sua chua
   //SELECT SUM(ct.SOLUONGXUAT) from chitiet_dh_px ct,phieuxuat_suachua px WHERE px.MAPHIEUXUAT_SC=ct.MAPHIEUXUAT_SC and px.TRANGTHAI='2' and ct.MAPHUTUNG='PT000002'
   //tong nhap kho
   //SELECT SUM(ct.SOLUONGNHAP) from phieunhap pn,chitiet_pn_pt ct WHERE pn.MAPHIEUNHAP=ct.MAPHIEUNHAP and pn.TRANGTHAIPN IN('2','3') and ct.MAPHUTUNG='PT000001'
   phutung.query("SELECT MAPHUTUNG,TENPHUTUNG,GIABAN,SOLUONGTON,TENDVT from phutung pt,donvitinh dvt WHERE dvt.ID_DVT= pt.ID_DVT", function(err, rows, fields) {
    if(err){
        res.send(result.error(1,"Database Error !"));
    }
    else
    {
        let dem=0;
        for(let i of rows)
        {
            phutung.query("SELECT SUM(ct.SOLUONGXUAT) AS SOLUONGXUAT from chitiet_dh_px ct,phieuxuat_suachua px WHERE px.MAPHIEUXUAT_SC=ct.MAPHIEUXUAT_SC and px.TRANGTHAI='2' and ct.MAPHUTUNG='"+i.MAPHUTUNG+"'",function(err,rowXK,fields){
                if(err)
                {
                    res.send(result.error(1,"Database Error !"));
                } else
                {
                   if(rowXK[0].SOLUONGXUAT)
                   i.SOLUONGXUAT=rowXK[0].SOLUONGXUAT;
                   else
                   i.SOLUONGXUAT=0;
                   phutung.query("SELECT SUM(ct.SOLUONGNHAP) AS SOLUONGNHAP from phieunhap pn,chitiet_pn_pt ct WHERE pn.MAPHIEUNHAP=ct.MAPHIEUNHAP and pn.TRANGTHAIPN IN('2','3') and ct.MAPHUTUNG='"+i.MAPHUTUNG+"'",function(err,rowNK,fields){
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    } else
                    {
                       if(rowNK[0].SOLUONGNHAP)
                       i.SOLUONGNHAP=rowNK[0].SOLUONGNHAP;
                       else
                       i.SOLUONGNHAP=0;
                       dem=dem+1;
                       if(dem==rows.length)
                       res.send(result.data(rows));
                    }
                });
                }
            });
        }
    }
});
}); 
//thong ke xuat kho sua chua
router.post('/thongkexuatsuachua',function(req,res){
    let que="SELECT px.NGAYLAP,px.MAPHIEUXUAT_SC,pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,ct.SOLUONGXUAT FROM phieuxuat_suachua px,chitiet_dh_px ct,phutung pt,donvitinh dvt WHERE pt.ID_DVT=dvt.ID_DVT and px.MAPHIEUXUAT_SC=ct.MAPHIEUXUAT_SC and pt.MAPHUTUNG=ct.MAPHUTUNG and px.TRANGTHAI='2' and px.NGAYLAP BETWEEN '"+req.body.NGAY_BD+"' AND '"+req.body.NGAY_KT+"'";
    phieuxuat_suachua.query(que,function(err,rows,fields){
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