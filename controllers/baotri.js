var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');

var Baotri=Db.extend({tableName:"baotri"});
var baotri=new Baotri();

var Chitiet_bt_pt=Db.extend({tableName:"chitiet_bt_pt"});
var chitiet_bt_pt=new Chitiet_bt_pt();

var Chitiet_bt_nv=Db.extend({tableName:"chitiet_bt_nv"});
var chitiet_bt_nv=new Chitiet_bt_nv();

//get all phieu bao tri
router.get('/',function(req,res){
    baotri.find('all',function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get phieu bao tri theo bien so xe
router.get('/biensoxe/:id',function(req,res){
    baotri.query("SELECT bt.MABAOTRI,bt.NGAYLAPBT,bt.NOIDUNGBT,bt.NGUOILAPPHIEUBT,bt.TRANGTHAIBT FROM xe x,phieukiemtra pkt,donhang dh,baotri bt WHERE x.MAXE=pkt.MAXE and pkt.ID_PHIEUKHAM=dh.ID_PHIEUKHAM and dh.MADONHANG=bt.MADONHANG and x.MAXE='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.post('/', function(req, res){
    baotri.query("SELECT createMaBaoTri() as MABAOTRI",function(err,rowMA,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            var MABAOTRI='BT000001';
            if(rowMA[0].MABAOTRI)
            MABAOTRI='BT'+rowMA[0].MABAOTRI;
            baotri.set('MABAOTRI',MABAOTRI);
            baotri.set('MADONHANG',req.body.phieu.MADONHANG);
            baotri.set('NGAYLAPBT',req.body.phieu.NGAYLAPBT);
            baotri.set('NOIDUNGBT',req.body.phieu.NOIDUNGBT);
            baotri.set('NGUOILAPPHIEUBT',req.body.phieu.NGUOILAPPHIEUBT);
            baotri.set('TRANGTHAIBT','1');
            baotri.save(function(err, row){
                if(err){
                    res.send(result.error(1,"Database Error !"));
                }else {
                    //luu chi tiet phu tung bao tri
                    let dem=0;
                    for(let i of req.body.data)
                    {
                        luuCT_PT_BT(MABAOTRI,i.MAPHUTUNG,i.SOLUONG,i.THAYMOI,i.GHICHU); 
                        dem=dem+1;
                    }
                    if(dem==req.body.data.length)
                    res.send(result.data(baotri));
                }
            });
        }
    });
});
//cap nhat trang thai 
router.post('/dsphieubaotri/xacnhan', function(req, res){
    console.log(req.body);
    if(req.body.MABAOTRI)
    {
        baotri.set('TRANGTHAIBT',req.body.TRANGTHAIBT);
        baotri.save("MABAOTRI='"+req.body.MABAOTRI+"'",function(err, row){
        if(err){
            res.send(result.error(1,"Database Error !"));
        }else{
            res.send(result.data(baotri));
        }
    });
    }
     else{
    res.send(result.error(2,"Missing field"));
    }
});
//cap nhat nhan vien bao tri
router.post('/baotri/capnhatnv', function(req, res){
    if(req.body)
    {
        chitiet_bt_nv.query("DELETE from chitiet_bt_nv where MABAOTRI='"+req.body.phieu.MABAOTRI+"'",function(err,row,fields){
            if(err)
            {
                res.send(result.error(1,"Database Error !"));
            }
            else
            {
                var dem=0;
                for(i of req.body.data)
                {
                    chitiet_bt_nv.set('MABAOTRI',req.body.phieu.MABAOTRI);
                    chitiet_bt_nv.set('MANHANVIEN',i.MANHANVIEN);
                    chitiet_bt_nv.set('TRANGTHAICV','1');
                    chitiet_bt_nv.save(function(err, row){
                    if(err){
                        res.send(result.error(1,"Database Error !"));
                    }
                    else{
                    }
                    });
                    dem++;
                }
                if(dem==req.body.data.length)
                res.send(result.data(chitiet_bt_nv));
            }
        });
    }
     else{
    res.send(result.error(2,"Missing field"));
    }
});
function luuCT_PT_BT(MABAOTRI,MAPHUTUNG,SOLUONG,THAYMOI,GHICHU)
{
    chitiet_bt_pt.set('MABAOTRI',MABAOTRI);
    chitiet_bt_pt.set('MAPHUTUNG',MAPHUTUNG);
    chitiet_bt_pt.set('SOLUONG',SOLUONG);
    chitiet_bt_pt.set('THAYMOI',THAYMOI);
    chitiet_bt_pt.set('GHICHU',GHICHU);
    chitiet_bt_pt.save(function(err, row){
    });  
}
module.exports =router;