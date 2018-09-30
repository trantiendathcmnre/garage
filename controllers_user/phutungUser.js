var fs =require('fs');
var bodyParser=require('body-parser');
var url = require('url');
var multer=require('multer');
var express=require('express');
var upload=multer({dest:"tmp/"});
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var PhuTung=Db.extend({tableName:"phutung"});
var phutung=new PhuTung();
//get thong tin cho admin - toan bo phu tung
router.get('/:hx/:dx/:dm',function(req,res){
    var query='';
    //Ma Hang Xe=0
    console.log(req.params.ncc);
    if(req.params.hx=='0' && req.params.dx=='0' && req.params.dm=='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG";
    }
    if(req.params.hx=='0' && req.params.dx=='0' && req.params.dm!='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where dm.MADMPHUTUNG='"+req.params.dm+"'";
    }
    if(req.params.hx=='0' && req.params.dx!='0' && req.params.dm=='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where dx.MADONGXE='"+req.params.dx+"'";
    }
    if(req.params.hx=='0' && req.params.dx!='0' && req.params.dm!='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where dx.MADONGXE='"+req.params.dx+"' and dm.MADMPHUTUNG='"+req.params.dm+"'";
    }
    //Ma Hang Xe !=0
    if(req.params.hx!='0' && req.params.dx=='0' && req.params.dm=='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where hx.MAHANGXE='"+req.params.hx+"'";
    }
    if(req.params.hx!='0' && req.params.dx=='0' && req.params.dm!='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where hx.MAHANGXE='"+req.params.hx+"' and dm.MADMPHUTUNG='"+req.params.dm+"'";
    }
    if(req.params.hx!='0' && req.params.dx!='0' && req.params.dm=='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where hx.MAHANGXE='"+req.params.hx+"' and dx.MADONGXE='"+req.params.dx+"'";
    }
    if(req.params.hx!='0' && req.params.dx!='0' && req.params.dm!='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where hx.MAHANGXE='"+req.params.hx+"' and dx.MADONGXE='"+req.params.dx+"' and dm.MADMPHUTUNG='"+req.params.dm+"'";
    }
     phutung.query(query,function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            var reqUrl = url.format({
                protocol: req.protocol,
                host: req.get('host'),
                // pathname: req.originalUrl,
            });
            for (i of rows)
            {
            if(i.ANH)
            i.ANH=reqUrl+'/img/'+i.ANH;
            }
            console.log(rows);
            res.send(result.data(rows));
        }
    });
});
module.exports =router;