var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var dateFormat = require('dateformat');
var result=require('../modules/response-result');

var PhieuNhap=Db.extend({tableName:"phieunhap"});
var phieunhap=new PhieuNhap();

var PhieuDat=Db.extend({tableName:"phieu_dat_hang"});
var phieudat=new PhieuDat();

var CT_PhieuNhap=Db.extend({tableName:"chitiet_pn_pt"});
var ct_phieunhap=new CT_PhieuNhap();
var PhuTung=Db.extend({tableName:"phutung"});
var phutung=new PhuTung();

var Ct_thanhtoan_ncc=Db.extend({tableName:"ct_thanhtoan_ncc"});
var ct_thanhtoan_ncc=new Ct_thanhtoan_ncc();

router.use(function(req,res,next){next();});
router.get('/',function(req,res){
    phieunhap.find('all',function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//
router.get('/phieunhapxn',function(req,res){
    phieunhap.find('all',{where:'TRANGTHAIPN IN("2","3")'},function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get thong tin phieu nhap
router.get('/:id',function(req,res){
    phieunhap.find('first',{where: "MAPHIEUNHAP = '"+req.params.id+"'"},function(err,row){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row));
        }
    });
});
//get thong tin danh sach phu tung trong phieu nhap
router.get('/dsphutung/:id',function(req,res){
    phieunhap.query('SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,ct.SOLUONGNHAP,ct.DONGIANHAP,dvt.TENDVT from donvitinh dvt, phieunhap pn,chitiet_pn_pt ct,phutung pt where pt.ID_DVT=dvt.ID_DVT and pt.MAPHUTUNG=ct.MAPHUTUNG and pn.MAPHIEUNHAP=ct.MAPHIEUNHAP and pn.MAPHIEUNHAP="'+req.params.id+'"',function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row));
        }
    });
});
router.get('/taoma/maphieunhap',function(req,res){
    phieunhap.query("SELECT createMaPhieuNhap() as MAPHIEUNHAP",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row));
        }
    });
});
//get nha cung cap theo phieu nhap
router.get('/pn/ncc/:id',function(req,res){
    phieunhap.query("SELECT DISTINCT ncc.ID_NCC ,ncc.TENNCC FROM phieunhap pn,phutung pt,chitiet_pn_pt ct,nhacungcap ncc WHERE pn.MAPHIEUNHAP=ct.MAPHIEUNHAP and pt.MAPHUTUNG=ct.MAPHUTUNG and ncc.ID_NCC=pt.ID_NCC and pn.MAPHIEUNHAP='"+req.params.id+"'",function(err,row,fields){
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
    console.log('luu phieu');
    
    if(req.body.phieu.MAPHIEUNHAP){
        tongtien=0;
        for(let i of req.body.data)
        {
            tongtien+=i.THANHTIEN;
        }
       
        console.log(req.body.phieu);
        phieunhap.set('MAPHIEUNHAP',req.body.phieu.MAPHIEUNHAP);
        phieunhap.set('NGAYLAPPN',req.body.phieu.NGAYLAPPN);
        phieunhap.set('TONGTIEN',tongtien);
        console.log(tongtien);
        // phieunhap.set('ID_NCC',parseInt(req.body.phieu.ID_NCC));
        phieunhap.set('TIENNO',tongtien);
        phieunhap.set('TIENTHANHTOAN_PN',0);
        phieunhap.set('TRANGTHAIPN','1');
        phieunhap.set('NGUOIGIAO',req.body.phieu.NGUOIGIAO);
        phieunhap.set('NGUOILAPPHIEU',req.body.phieu.NGUOILAPPHIEU);
        phieunhap.set('GHICHU',req.body.phieu.GHICHU);
        phieunhap.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
                console.log('loi luu phieu nhap');
            }else {
                //Luu chi tiet phieu nhap
                var dem=0;
                for (i of req.body.data) {
                    luu_ct_pn(req.body.phieu.MAPHIEUNHAP,i.MAPHUTUNG,i.SOLUONGNHAP,i.DONGIANHAP);
                    dem=dem+1;
                    console.log('hihi');
                 }
                 if(dem==req.body.data.length)
                 {
                    if(req.body.phieu.MAPHIEUDATHANG!='0')
                    {
                        console.log(req.body.phieu.MAPHIEUDATHANG);
                        console.log('phieu dat hang');
                        phieudat.set('TRANGTHAIPD','3');
                        phieudat.save("MAPHIEUDATHANG='"+req.body.phieu.MAPHIEUDATHANG+"'",function(err, row){
                            if(err){
                                res.send(result.error(1,"Database Error !"));
                            }else{
                            res.send(result.data(phieunhap));
                            }
                        });
                    }
                    else
                    {
                    res.send(result.data(phieunhap));
                    }
                }
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//cap nhat phieu nhap
router.put('/', function(req, res){
    console.log(req.body);
    if(req.body.phieu.MAPHIEUNHAP){
        tongtien=0;
        for(let i of req.body.data)
        {
            tongtien+=(i.DONGIANHAP*i.SOLUONGNHAP);
        }
        console.log(tongtien);
        phieunhap.set('TONGTIEN',tongtien);
        phieunhap.set('TIENNO',tongtien);
        phieunhap.set('TIENTHANHTOAN_PN',0);
        phieunhap.set('GHICHU',req.body.phieu.GHICHU);
        phieunhap.save("MAPHIEUNHAP='"+req.body.phieu.MAPHIEUNHAP+"'",function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                //Luu chi tiet phieu nhap
                ct_phieunhap.query("DELETE FROM chitiet_pn_pt WHERE MAPHIEUNHAP='"+req.body.phieu.MAPHIEUNHAP+"'",function(err,row,fields){
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    }
                    else
                    {
                        var dem=0;
                        for (i of req.body.data) {
                            luu_ct_pn(req.body.phieu.MAPHIEUNHAP,i.MAPHUTUNG,i.SOLUONGNHAP,i.DONGIANHAP);
                            dem=dem+1;
                         }
                         console.log(dem);
                         console.log(req.body.data.length);
                         if(dem==req.body.data.length){     
                            res.send(result.data(phieunhap));
                        }
                    }
                });  
                
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//-------------------
router.post('/dsphieunhap', function(req, res){
    var q='SELECT DISTINCT pn.MAPHIEUNHAP,pn.NGAYLAPPN,pn.TONGTIEN,pn.TIENNO,pn.TIENTHANHTOAN_PN,pn.NGUOIGIAO,pn.NGUOILAPPHIEU,pn.GHICHU,pn.TRANGTHAIPN from phieunhap pn,phutung pt,chitiet_pn_pt ct WHERE pn.MAPHIEUNHAP=ct.MAPHIEUNHAP and ct.MAPHUTUNG=pt.MAPHUTUNG and pn.NGAYLAPPN BETWEEN "'+req.body.NGAY_BD+'" and "'+req.body.NGAY_KT+'" and pt.ID_NCC='+req.body.ID_NCC;
    if(req.body.ID_NCC)
    phieunhap.query(q,function(err,rows,fields){
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
var demsoluong=-1;
var jdemsoluong=0;
router.post('/dsphieunhap/xacnhan', function(req, res){
    console.log(req.body.TRANGTHAIPN);
    demsoluong=-1;
    jdemsoluong=0;
    if(req.body.MAPHIEUNHAP)
    {
    phieunhap.set('TRANGTHAIPN',req.body.TRANGTHAIPN);
    phieunhap.save("MAPHIEUNHAP='"+req.body.MAPHIEUNHAP+"'",function(err, row){
        if(err){
            res.send(result.error(1,"Database Error !"));
        }else{
            
             if(req.body.TRANGTHAIPN=='1')//go cap nhat hang vao kho
             {
                UnUpdate(req.body.MAPHIEUNHAP);
                if(demsoluong==jdemsoluong)
                {
                    res.send(result.data(phieunhap));
                }
             }
             if(req.body.TRANGTHAIPN=='2')
             {
                 console.log('update');
                Update(req.body.MAPHIEUNHAP);
                res.send(result.data(phieunhap));
             }
             else
             res.send(result.data(phieunhap));
        }
    });
    }
     else{
    res.send(result.error(2,"Missing field"));
    }
});
function Update(MAPHIEUNHAP)
{
    ct_phieunhap.find('all',{where: 'MAPHIEUNHAP="'+MAPHIEUNHAP+'"'},function(err,rows,fields){
        if(err)
        {
        } else
        {
            demsoluong=rows.length;
            for(let i of rows)
            {
                let q='UPDATE phutung set SOLUONGTON=SOLUONGTON+'+parseInt(i.SOLUONGNHAP)+' WHERE MAPHUTUNG="'+i.MAPHUTUNG+'"';
                phutung.query(q,function(err,rows,fields){
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                      
                    }
                    jdemsoluong++;
                });
            }
        }
    });
}
function UnUpdate(MAPHIEUNHAP)
{
    ct_phieunhap.find('all',{where: 'MAPHIEUNHAP="'+MAPHIEUNHAP+'"'},function(err,rows,fields){
        if(err)
        {
        } else
        {
            demsoluong=rows.length;
            for(let i of rows)
            {
                console.log(i.MAPHUTUNG);
                phutung.query('UPDATE phutung set SOLUONGTON=SOLUONGTON-'+parseFloat(i.SOLUONGNHAP)+' WHERE MAPHUTUNG="'+i.MAPHUTUNG+'"',function(err,rows,fields){
                    if(err){} else {}
                    jdemsoluong++;
                });
            }
        }
    });
}
function luu_ct_pn(MaPhieu,MaVT,SoLuong,GiaNhap)
{
    ct_phieunhap.set('MAPHIEUNHAP',MaPhieu);
    ct_phieunhap.set('MAPHUTUNG',MaVT);
    ct_phieunhap.set('SOLUONGNHAP',SoLuong);
    ct_phieunhap.set('DONGIANHAP',GiaNhap);
    ct_phieunhap.save(function(err, row){
    });    
}
//get thong tin phieu nhap vs nha cung cap
router.get('/phieuhap_ncc/:id',function(req,res){
    console.log('ahihi');
    phieunhap.query('SELECT DISTINCT * FROM phieunhap pn,phutung pt,chitiet_pn_pt ct,nhacungcap ncc WHERE pn.MAPHIEUNHAP=ct.MAPHIEUNHAP and pt.MAPHUTUNG=ct.MAPHUTUNG and ncc.ID_NCC=pt.ID_NCC and pn.MAPHIEUNHAP="'+req.params.id+'"',function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row[0]));
        }
    });
});
//cap nhat cong no nha cung cap
router.post('/congnoncc', function(req, res){
    console.log(req.body);
    if(req.body.MAPHIEUNHAP && req.body.TIENTHANHTOAN_NCC){
        ct_thanhtoan_ncc.set('MAPHIEUNHAP',req.body.MAPHIEUNHAP);
        ct_thanhtoan_ncc.set('NGAYTHANHTOAN_NCC',req.body.NGAYTHANHTOAN_NCC);
        ct_thanhtoan_ncc.set('NGUOITHANHTOAN_NCC',req.body.NGUOITHANHTOAN_NCC);
        ct_thanhtoan_ncc.set('TIENTHANHTOAN_NCC',req.body.TIENTHANHTOAN_NCC);
        ct_thanhtoan_ncc.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                phieunhap.find('first', {where: "MAPHIEUNHAP='"+req.body.MAPHIEUNHAP+"'"}, function(err, rowDH) {
                    if(err)
                    {
                        res.send(result.error(1,"Database Error !"));
                    }
                    else
                    {
                        phieunhap.set('TIENTHANHTOAN_PN',parseInt(rowDH.TIENTHANHTOAN_PN)+parseInt(req.body.TIENTHANHTOAN_NCC));//phe duyet
                        phieunhap.set('TIENNO',parseInt(rowDH.TIENNO)-parseInt(req.body.TIENTHANHTOAN_NCC));
                        phieunhap.set('TRANGTHAIPN','3');
                        phieunhap.save("MAPHIEUNHAP='"+req.body.MAPHIEUNHAP+"'",function(err, rowU){
                            if(err)
                            {
                                res.send(result.error(1,"Database Error !"));
                            }
                            else
                            {
                                res.send(result.data(phieunhap));
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
//get thong tin cong no nha cung cap
router.get('/congnoncc/:id',function(req,res){
    console.log(req.params.id);
    ct_thanhtoan_ncc.find('all',{where: "MAPHIEUNHAP='"+req.params.id+"'"},function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//cap nhat gia nhap cho phu tung
router.post('/capnhatgia', function(req, res){
    console.log(req.body);
    let dem=0;
    ct_phieunhap.find('all', {where: "MAPHIEUNHAP='"+req.body.MAPHIEUNHAP+"'"}, function(err, rows, fields) {
        for(let i of rows)
        {
            phutung.query('UPDATE phutung set GIANHAP='+i.DONGIANHAP+' WHERE MAPHUTUNG="'+i.MAPHUTUNG+'"',function(err,row,fields){
                if(err)
                {
                    res.send(result.error(1,"Database Error !"));
                }else
                {
                    dem=dem+1;
                    console.log(dem);
                }
            });
        }
        res.send(result.data([]));
    });
});
module.exports =router;