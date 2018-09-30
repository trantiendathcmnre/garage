var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var dateFormat = require('dateformat');
var result=require('../modules/response-result');
var PhieuDat=Db.extend({tableName:"phieu_dat_hang"});
var phieudat=new PhieuDat();
var CT_PhieuDat=Db.extend({tableName:"chitiet_pd_pt"});
var ct_phieudat=new CT_PhieuDat();
// router.use(function(req,res,next){next();});
router.get('/',function(req,res){
    // phieudat.query("SELECT * FROM `phieu_dat_hang` p,`nhacungcap` ncc WHERE p.ID_NCC=ncc.ID_NCC",function(err,rows,fields){
        phieudat.query("SELECT DISTINCT pd.MAPHIEUDATHANG,pd.NGAYLAPPD,pd.NGUOILAPPHIEUDAT,pd.TONGSOPT,pd.GHICHU_PD,pd.TRANGTHAIPD,ncc.TENNCC FROM phieu_dat_hang pd,phutung pt,nhacungcap ncc,chitiet_pd_pt ct where pt.ID_NCC=ncc.ID_NCC and ct.MAPHUTUNG=pt.MAPHUTUNG and ct.MAPHIEUDATHANG=ct.MAPHIEUDATHANG",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get phieu dat
router.get('/phieu/:id',function(req,res){
    // phieudat.query("SELECT p.MAPHIEUDATHANG,ncc.TENNCC,p.NGAYLAPPD,p.NGUOILAPPHIEUDAT,p.TONGSOPT,p.GHICHU_PD,p.TRANGTHAIPD FROM phieu_dat_hang p,nhacungcap ncc WHERE p.ID_NCC=ncc.ID_NCC and p.MAPHIEUDATHANG='"+req.params.id+"'",function(err,rows,fields){
    phieudat.query("SELECT DISTINCT pd.MAPHIEUDATHANG,pd.NGAYLAPPD,pd.NGUOILAPPHIEUDAT,pd.TONGSOPT,pd.GHICHU_PD,pd.TRANGTHAIPD,ncc.TENNCC,ncc.ID_NCC,ncc.DIACHI_NCC,ncc.SDT_NCC FROM phieu_dat_hang pd,phutung pt,nhacungcap ncc,chitiet_pd_pt ct where pt.ID_NCC=ncc.ID_NCC and ct.MAPHUTUNG=pt.MAPHUTUNG and ct.MAPHIEUDATHANG=ct.MAPHIEUDATHANG and pd.MAPHIEUDATHANG='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(rows));
        }
    });
});
//get chi tiet phieu dat
router.get('/:id',function(req,res){
    phieudat.query("SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,ct.SOLUONGDAT,ct.MAPHIEUDATHANG FROM chitiet_pd_pt ct,phutung pt,donvitinh dvt WHERE dvt.ID_DVT=pt.ID_DVT and pt.MAPHUTUNG=ct.MAPHUTUNG AND ct.MAPHIEUDATHANG='"+req.params.id+"'",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row));
        }
    });
});
router.get('/ncc/:id',function(req,res){
   // phieudat.query("SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,ct.SOLUONGDAT,ct.MAPHIEUDATHANG FROM chitiet_pd_pt ct,phutung pt,donvitinh dvt WHERE dvt.ID_DVT=pt.ID_DVT and pt.MAPHUTUNG=ct.MAPHUTUNG and ncc.ID_NCC='"+req.params.id+"' and p.TRANGTHAIPD ='2'",function(err,rows,fields){
    phieudat.query("SELECT DISTINCT pd.MAPHIEUDATHANG,pd.NGAYLAPPD FROM phieu_dat_hang pd,phutung pt,nhacungcap ncc,chitiet_pd_pt ct where pt.ID_NCC=ncc.ID_NCC and ct.MAPHUTUNG=pt.MAPHUTUNG and ct.MAPHIEUDATHANG=ct.MAPHIEUDATHANG and ncc.ID_NCC='"+req.params.id+"' and pd.TRANGTHAIPD ='2'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/taoma/maphieudat',function(req,res){
    phieudat.query("SELECT createMaPhieuDat() as MAPHIEUDAT",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row));
        }
    });
});
router.post('/', function(req, res){
    T_SOLUONGDAT=0;
     for (i of req.body.data)
     {
        T_SOLUONGDAT+=i.SOLUONGDAT;
     }
    if(req.body.phieu.MAPHIEUDATHANG){
        phieudat.set('MAPHIEUDATHANG',req.body.phieu.MAPHIEUDATHANG);
        phieudat.set('NGAYLAPPD',req.body.phieu.NGAYLAPPD);
        phieudat.set('TONGSOPT',T_SOLUONGDAT);
        phieudat.set('NGUOILAPPHIEUDAT',req.body.phieu.NGUOILAPPHIEUDAT);
        phieudat.set('GHICHU_PD',req.body.phieu.GHICHU_PD);
        phieudat.set('TRANGTHAIPD','1');
        phieudat.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                //Luu chi tiet phieu dat
                for (i of req.body.data) {
                    console.log(i);
                    luu_ct_pd(req.body.phieu.MAPHIEUDATHANG,i.MAPHUTUNG,i.SOLUONGDAT);
                 }
                res.send(result.data(phieudat));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
router.post('/dsphieudat/xacnhan', function(req, res){
    console.log(req.body);
    if(req.body.MAPHIEUDATHANG)
    {
    phieudat.set('TRANGTHAIPD',req.body.TRANGTHAIPD);
    phieudat.save("MAPHIEUDATHANG='"+req.body.MAPHIEUDATHANG+"'",function(err, row){
        if(err){
            res.send(result.error(1,"Database Error !"));
        }else{
            res.send(result.data(phieudat));
        }
    });
    }
     else{
    res.send(result.error(2,"Missing field"));
    }
});
function luu_ct_pd(MAPHIEUDATHANG,MAPHUTUNG,SOLUONGDAT)
{
    ct_phieudat.set('MAPHUTUNG',MAPHUTUNG);
    ct_phieudat.set('MAPHIEUDATHANG',MAPHIEUDATHANG);
    ct_phieudat.set('SOLUONGDAT',SOLUONGDAT);
    ct_phieudat.save(function(err, row){
    });  
}
router.put('/', function(req, res){
    console.log(req.body);
    T_SOLUONGDAT=0;
     for (i of req.body.data)
     {
        T_SOLUONGDAT+=i.SOLUONGDAT;
     }
    if(req.body.phieu.MAPHIEUDATHANG){
        phieudat.set('TONGSOPT',T_SOLUONGDAT);
        phieudat.set('GHICHU_PD',req.body.phieu.GHICHU_PD);
        phieudat.save("MAPHIEUDATHANG='"+req.body.phieu.MAPHIEUDATHANG+"'",function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                //Xoa chi tiet phu tung cu
                ct_phieudat.query("DELETE FROM chitiet_pd_pt WHERE MAPHIEUDATHANG='"+req.body.phieu.MAPHIEUDATHANG+"'",function(err,row,fields){
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    }
                    else
                    {
                        for (i of req.body.data) {
                            console.log(i);
                            luu_ct_pd(req.body.phieu.MAPHIEUDATHANG,i.MAPHUTUNG,i.SOLUONGDAT);
                         }
                         res.send(result.data(phieudat));
                    }
                })  
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
module.exports =router;