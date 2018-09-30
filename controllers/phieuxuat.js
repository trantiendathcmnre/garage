var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var dateFormat = require('dateformat');
var result=require('../modules/response-result');

var Phieuxuat_suachua=Db.extend({tableName:"phieuxuat_suachua"});
var phieuxuat_suachua=new Phieuxuat_suachua();

var Phieuxuat_baotri=Db.extend({tableName:"phieuxuat_baotri"});
var phieuxuat_baotri=new Phieuxuat_baotri();

var Phieuxuat=Db.extend({tableName:"phieuxuat"});
var phieuxuat=new Phieuxuat();
//chi tiet cac phieu xuat
var Chitiet_dh_px=Db.extend({tableName:"chitiet_dh_px"});
var chitiet_dh_px=new Chitiet_dh_px();

var Chitiet_px=Db.extend({tableName:"chitiet_px"});
var chitiet_px=new Chitiet_px();

router.get('/taoma/maphieuxuatsuachua',function(req,res){
    phieuxuat_suachua.query("select CAST(substring((SELECT x.MAPHIEUXUAT_SC FROM phieuxuat_suachua x ORDER BY x.MAPHIEUXUAT_SC DESC LIMIT 1),5) as INT)+1 as MAPHIEUXUAT",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            if(!row[0].MAPHIEUXUAT)
            row[0].MAPHIEUXUAT='PXSC000001';
            else
            row[0].MAPHIEUXUAT='PXSC'+lpad(row[0].MAPHIEUXUAT);
            res.send(result.data(row));
        }
    });
});
router.get('/taoma/maphieuxuatbaotri',function(req,res){
    phieuxuat_baotri.query("SELECT createMaPhieuXuatBaoTri() as MAPHIEUXUAT_BT",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            if(!row[0].MAPHIEUXUAT_BT)
            row[0].MAPHIEUXUAT_BT='PXBT000001';
            else
            row[0].MAPHIEUXUAT_BT='PXBT'+row[0].MAPHIEUXUAT_BT;
            res.send(result.data(row));
        }
    });
});
//ma phieu xuat khac
router.get('/taoma/maphieuxuat',function(req,res){
    phieuxuat_baotri.query("SELECT createMaPhieuXuat() as MAPHIEU",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            if(!row[0].MAPHIEU)
            row[0].MAPHIEU='PX000001';
            else
            row[0].MAPHIEU='PX'+row[0].MAPHIEU;
            res.send(result.data(row));
        }
    });
});
//lpad
function  lpad(str){
    if(str<10)
    {
        return '00000'+str;

    }
    else
    if(str<100)
    {
        return '0000'+str;
    }
    else
    if(str<1000)
    {
        return '000'+str;
    }
    else
    if(str<10000)
    {
        return '00'+str;
    }
}
//luu phieu xuat sua chua
router.post('/', function(req, res){
    console.log(req.body);
    if(req.body.phieu.MAPHIEU){
        tongsoluong=0;
        for(let i of req.body.data)
        {
            tongsoluong+=i.SOLUONG;
        }
        console.log(req.body.phieu);
        phieuxuat_suachua.set('MAPHIEUXUAT_SC',req.body.phieu.MAPHIEU);
        phieuxuat_suachua.set('MADONHANG',req.body.phieu.MADONHANG);
        phieuxuat_suachua.set('NGAYLAP',req.body.phieu.NGAYLAP);
        phieuxuat_suachua.set('NGUOILAP',req.body.phieu.NGUOILAPPHIEU);
        phieuxuat_suachua.set('TONGSOPT',tongsoluong);
        phieuxuat_suachua.set('NHANVIENNHAN',req.body.phieu.MANHANVIEN);
        phieuxuat_suachua.set('GHICHU',req.body.phieu.GHICHU);
        phieuxuat_suachua.set('TRANGTHAI','1');
        phieuxuat_suachua.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
                console.log('loi luu phieu nhap');
            }else {
                //Luu chi tiet phieu nhap
                var dem=0;
                for (i of req.body.data) {
                    luu_ct_pn(req.body.phieu.MAPHIEU,i.MAPHUTUNG,i.SOLUONG);
                    dem=dem+1;
                    console.log('hihi');
                 }
                 if(dem==req.body.data.length)
                 {
                    
                    res.send(result.data(phieuxuat_suachua));
                }
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//luu chi tiet phieu xuat sua chua
function luu_ct_pn(MaPhieu,MaVT,SoLuong)
{
    chitiet_dh_px.set('MAPHIEUXUAT_SC',MaPhieu);
    chitiet_dh_px.set('MAPHUTUNG',MaVT);
    chitiet_dh_px.set('SOLUONGXUAT',SoLuong);
    chitiet_dh_px.save(function(err, row){
    });    
}
//luu phieu xuat khac
router.post('/khac', function(req, res){
    console.log(req.body);
    if(req.body.phieu.MAPHIEU){
        tongsoluong=0;
        for(let i of req.body.data)
        {
            tongsoluong+=i.SOLUONG;
        }
        console.log(req.body.phieu);
        phieuxuat.set('MAPHIEU',req.body.phieu.MAPHIEU);
        phieuxuat.set('LOAIPHIEU','0');
        phieuxuat.set('NGAYLAPPHIEU',req.body.phieu.NGAYLAP);
        phieuxuat.set('NGUOILAP',req.body.phieu.NGUOILAPPHIEU);
        phieuxuat.set('TONGSOPT',tongsoluong);
        phieuxuat.set('NHANVIENNHAN',req.body.phieu.MANHANVIEN);
        phieuxuat.set('GHICHU',req.body.phieu.GHICHU);
        phieuxuat.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
                console.log('loi luu phieu nhap');
            }else {
                //Luu chi tiet phieu nhap
                var dem=0;
                for (i of req.body.data) {
                    luu_ct_pxkhac(req.body.phieu.MAPHIEU,i.MAPHUTUNG,i.SOLUONG);
                    dem=dem+1;
                    console.log('hihi');
                 }
                 if(dem==req.body.data.length)
                 {
                    
                    res.send(result.data(phieuxuat_baotri));
                }
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
//luu chi tiet phieu xuat khac
function luu_ct_pxkhac(MaPhieu,MaVT,SoLuong)
{
    chitiet_px.set('MAPHIEU',MaPhieu);
    chitiet_px.set('MAPHUTUNG',MaVT);
    chitiet_px.set('SOLUONGXUAT',SoLuong);
    chitiet_px.save(function(err, row){
    });    
}
//luu phieu xuat khac
//xac nhan phieu xuat sua chua
router.post('/dsphieuxuatsuachua/xacnhan', function(req, res){
    console.log(req.body);
    phieuxuat_suachua.set('TRANGTHAI',req.body.TRANGTHAI);
    phieuxuat_suachua.save("MAPHIEUXUAT_SC='"+req.body.MAPHIEUXUAT_SC+"'",function(err, row){
        if(err) {
        }
        else
        {
            if(req.body.TRANGTHAI!='0' && req.body.TRANGTHAI!='3')
            {
                chitiet_dh_px.find('all', {where: "MAPHIEUXUAT_SC='"+req.body.MAPHIEUXUAT_SC+"'"}, function(err, rows, fields) {
                    if(err){}
                    else
                    {
                    for(let i of rows)
                    {
                        i.SOLUONG=i.SOLUONGXUAT;
                    }
                    console.log('123');
                    res.send(result.data(rows));
                    }
                });
            }
            else
            res.send(result.data(row));
        }
    });
});
//cap nhat lai kho phu tung -
router.post('/capnhat', function(req, res){
    console.log(req.body);
    let dem=0;
    for (i of req.body.data) {
        phieuxuat_suachua.query('UPDATE phutung SET SOLUONGTON=SOLUONGTON-'+i.SOLUONG+' WHERE MAPHUTUNG="'+i.MAPHUTUNG+'"',function(err,row,fields){
        if(err)
        {

        }
        else
        {
            dem++;
        }
        if(dem==req.body.data.length){
            res.send(result.data(phieuxuat_suachua));}
       });
     }
});
//cap nhat kho phu tung + khi huy xuat kho
router.post('/capnhatcong', function(req, res){
    console.log(req.body);
    let dem=0;
    for (i of req.body.data) {
        phieuxuat_suachua.query('UPDATE phutung SET SOLUONGTON=SOLUONGTON+'+i.SOLUONG+' WHERE MAPHUTUNG="'+i.MAPHUTUNG+'"',function(err,row,fields){
        if(err)
        {

        }
        else
        {
            dem++;
        }
        if(dem==req.body.data.length){
            res.send(result.data(phieuxuat_suachua));}
       });
     }
});
//get cac phieu xuat sua chua -0:phieu sua chua-1:phieu bao tri-trong menu cac loai phieu xuat
router.get('/loaiphieuxuat/:id',function(req,res){
    let que='';
    if(req.params.id=='0')
    que="SELECT DISTINCT px.MAPHIEUXUAT_SC,px.NGAYLAP,px.TONGSOPT,x.BIENSOXE,nv.TENNHANVIEN,px.GHICHU,px.TRANGTHAI,px.NGUOILAP FROM phieuxuat_suachua px,donhang dh,nhanvien nv,phieukiemtra pkt,xe x WHERE px.MADONHANG=dh.MADONHANG and dh.ID_PHIEUKHAM=pkt.ID_PHIEUKHAM and pkt.MAXE=x.MAXE and nv.MANHANVIEN=px.NHANVIENNHAN";
    if(req.params.id=='2')
    que='SELECT	* FROM phieuxuat';
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
//get chi tiet phu tung theo ma phieu xuat
router.get('/chitiet/maphieuxuatsc/:id',function(req,res){
    phieuxuat_suachua.query("SELECT ct.MAPHUTUNG,pt.TENPHUTUNG,ct.SOLUONGXUAT,dvt.TENDVT FROM phutung pt,chitiet_dh_px ct,donvitinh dvt WHERE dvt.ID_DVT=pt.ID_DVT and pt.MAPHUTUNG=ct.MAPHUTUNG and ct.MAPHIEUXUAT_SC='"+req.params.id+"'",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row));
        }
    });
});
module.exports =router;