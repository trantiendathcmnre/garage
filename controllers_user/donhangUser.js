var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var moment = require('../node_modules/moment');
var DonHang=Db.extend({tableName:"donhang"});
var donhang=new DonHang();
//get tat cac don hang theo bien so
//http://localhost:88/usuachua/77C1-2012
router.get('/:id',function(req,res){
    donhang.query("SELECT dh.MADONHANG,dh.TRANGTHAI_DH,dh.NGAYLAPDH,dh.TIENPHUTUNG,dh.TIENNHANCONG,dh.TONGTIEN,dh.THANHTOAN,dh.GIAMGIA FROM donhang dh,phieukiemtra pkt,xe x WHERE dh.ID_PHIEUKHAM=pkt.ID_PHIEUKHAM and dh.TRANGTHAI_DH IN ('2','3','4') and x.MAXE=pkt.MAXE and x.BIENSOXE='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//chi tiet phu tung trong don hang
//http://localhost:88/usuachua/chitiet/DH000001
router.get('/chitietphutung/:id',function(req,res){
    donhang.query("SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,ct.DONGIA,ct.SOLUONGXACNHAN from chitiet_pt_dh ct,phutung pt WHERE ct.MAPHUTUNG=pt.MAPHUTUNG and ct.MADONHANG='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//chi tiet phan cong don hang
//http://localhost:88/usuachua/chitietcong/DH000001
router.get('/chitietcong/:id',function(req,res){
    donhang.query("SELECT ct.MABAOGIACONG,bgc.TENBAOGIACONG,bgc.DONGIACONG,ct.SOLUONGXACNHAN  from  chitiet_dh_cong ct,baogiacong bgc WHERE ct.MABAOGIACONG=bgc.MABAOGIACONG and ct.MADONHANG='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get bao gia moi phu tung theo don hang
router.get('/baogiaphutungmoi/:id',function(req,res){
    donhang.query("SELECT pt.TENPHUTUNG,ct.SOLUONGTAMLUU,ct.DONGIA FROM donhang dh,chitiet_pt_dh ct,phutung pt WHERE dh.MADONHANG=ct.MADONHANG and pt.MAPHUTUNG=ct.MAPHUTUNG and dh.MADONHANG='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get bao gia moi cong theo don hang
router.get('/baogiacongmoi/:id',function(req,res){
    donhang.query("SELECT ct.MABAOGIACONG,bgc.TENBAOGIACONG,ct.SOLUONGTAMLUU,bgc.DONGIACONG  from  chitiet_dh_cong ct,baogiacong bgc WHERE ct.MABAOGIACONG=bgc.MABAOGIACONG and ct.MADONHANG='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//khach hang xac nhan đông ý sửa chữa báo phát phát sinh mới
//http://localhost:88/usuachua/xacnhan/DH000001/0
router.get('/xacnhan/:maDH/:id',function(req,res){
    let PHANHOI='Không đồng ý';
    if(req.params.id=='1')
    PHANHOI='Đồng ý';
    donhang.set('GHICHU_DH',PHANHOI);
    donhang.save("MADONHANG='"+req.params.maDH+"'",function(err, row){
        if(err){
            res.send(result.error(1,"Database Error !"));
        }else {
            res.send(result.data(row));
        }
    });
});
module.exports =router;