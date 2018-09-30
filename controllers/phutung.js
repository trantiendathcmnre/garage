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
var DonViTinh=Db.extend({tableName:"donvitinh"});
var donvitinh=new DonViTinh();
const filePath = 'img/';
router.use(function(req,res,next){next();});
router.get('/',function(req,res){
    phutung.query("SELECT * from phutung pt LEFT JOIN dongxe dx on pt.MADONGXE=dx.MADONGXE LEFT JOIN danhmucphutung dm on pt.MADMPHUTUNG=dm.MADMPHUTUNG LeFT JOIN hangxe hx on hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT",function(err,rows,fields){
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
            res.send(result.data(rows));
        }
    });
});
//get thong tin cho admin - toan bo phu tung
router.get('/all/admin/:hx/:dx/:dm',function(req,res){
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
//get thong tin cho admin
router.get('/admin/:hx/:dx/:dm/:ncc',function(req,res){
    var query='';
    //Ma Hang Xe=0
    console.log(req.params.ncc);
    if(req.params.hx=='0' && req.params.dx=='0' && req.params.dm=='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where pt.ID_NCC="+req.params.ncc;
    }
    if(req.params.hx=='0' && req.params.dx=='0' && req.params.dm!='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where dm.MADMPHUTUNG='"+req.params.dm+"' and pt.ID_NCC="+req.params.ncc;
    }
    if(req.params.hx=='0' && req.params.dx!='0' && req.params.dm=='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where dx.MADONGXE='"+req.params.dx+"' and pt.ID_NCC="+req.params.ncc;
    }
    if(req.params.hx=='0' && req.params.dx!='0' && req.params.dm!='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where dx.MADONGXE='"+req.params.dx+"' and dm.MADMPHUTUNG='"+req.params.dm+"' and pt.ID_NCC="+req.params.ncc;
    }
    //Ma Hang Xe !=0
    if(req.params.hx!='0' && req.params.dx=='0' && req.params.dm=='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where hx.MAHANGXE='"+req.params.hx+"' and pt.ID_NCC="+req.params.ncc;
    }
    if(req.params.hx!='0' && req.params.dx=='0' && req.params.dm!='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where hx.MAHANGXE='"+req.params.hx+"' and dm.MADMPHUTUNG='"+req.params.dm+"' and pt.ID_NCC="+req.params.ncc;
    }
    if(req.params.hx!='0' && req.params.dx!='0' && req.params.dm=='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where hx.MAHANGXE='"+req.params.hx+"' and dx.MADONGXE='"+req.params.dx+"' and pt.ID_NCC="+req.params.ncc;
    }
    if(req.params.hx!='0' && req.params.dx!='0' && req.params.dm!='0')
    {
    query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT,dx.TENDONGXE,dm.TENDMPHUTUNG,pt.SOLUONGTON,hx.TENHANGXE from phutung pt LEFT JOIN dongxe dx ON pt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx ON hx.MAHANGXE=dx.MAHANGXE LEFT JOIN donvitinh dvt ON pt.ID_DVT=dvt.ID_DVT LEFT JOIN danhmucphutung dm ON pt.MADMPHUTUNG=dm.MADMPHUTUNG where hx.MAHANGXE='"+req.params.hx+"' and dx.MADONGXE='"+req.params.dx+"' and dm.MADMPHUTUNG='"+req.params.dm+"' and pt.ID_NCC="+req.params.ncc;
    }
    // if(req.params.dm=='0' && req.params.id!='0')
    // {
    //     query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT from phutung pt,dongxe dx,hangxe hx,donvitinh dvt where pt.MADONGXE=dx.MADONGXE and hx.MAHANGXE=dx.MAHANGXE and pt.ID_DVT=dvt.ID_DVT and hx.MAHANGXE='"+req.params.id+"'";
    // }
    // if(req.params.dm!='0' && req.params.id=='0')
    // {
    //     query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT from phutung pt,danhmucphutung dm,donvitinh dvt where pt.ID_DVT=dvt.ID_DVT and pt.dm.MADMPHUTUNG=dm.MADMPHUTUNG and dm.MADMPHUTUNG='"+req.params.dm+"'";
    // }
    // else
    // if(req.params.dm!='0' && req.params.id!='0')
    // {
    //  query="SELECT pt.MAPHUTUNG,pt.TENPHUTUNG,dvt.TENDVT,pt.ANH,pt.GIABAN,pt.MOTA_PT from phutung pt,dongxe dx,hangxe hx,donvitinh dvt,danhmucphutung dm where dm.MADMPHUTUNG=pt.MADMPHUTUNG and pt.MADONGXE=dx.MADONGXE and hx.MAHANGXE=dx.MAHANGXE and pt.ID_DVT=dvt.ID_DVT and hx.MAHANGXE='"+req.params.id+"' and dm.MADMPHUTUNG='"+req.params.dm+"'";
    // }
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
//get thông tin cho phieu nhap
router.get('/phieunhap',function(req,res){
    vattu.query("SELECT vt.MAVATTU,vt.TENVATTU,vt.GIANHAP,dx.TENDONGXE,hx.TENHANGXE,vt.SOLUONGTON from phutung vt LEFT JOIN dongxe dx on vt.MADONGXE=dx.MADONGXE LEFT JOIN hangxe hx on hx.MAHANGXE=dx.MAHANGXE",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
//get DVT
router.get('/DVT/DVT',function(req,res){
    donvitinh.find('all',function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.post('/', upload.single('filetoupload'), function (req, res) {
    if(req.body.MAPHUTUNG && req.body.TENPHUTUNG){
        phutung.set('MAPHUTUNG',req.body.MAPHUTUNG);
        phutung.set('TENPHUTUNG',req.body.TENPHUTUNG);
        phutung.set('ID_DVT',req.body.ID_DVT);
        phutung.set('SOLUONGTON',0);
        phutung.set('MOTA_PT',req.body.MOTA_PT);
        if(req.body.THOIGIANBAOHANH)
        phutung.set('THOIGIANBAOHANH',req.body.THOIGIANBAOHANH);
        else
        phutung.set('THOIGIANBAOHANH',0);
        if(req.body.MADONGXE!='-1')
        phutung.set('MADONGXE',req.body.MADONGXE);
        if(req.body.MADMPHUTUNG!='-1')
        phutung.set('MADMPHUTUNG',req.body.MADMPHUTUNG);
        phutung.set('GIABAN',req.body.GIABAN);
        phutung.set('ID_NCC',req.body.ID_NCC);
        phutung.save(function(err, row){
            if (err) {
                res.send(result.error(1, 'DB error!'));
            } else {
                if (req.file) {
                   
                    let maPT = req.body.MAPHUTUNG;
                    console.log(maPT);
                    let fileName = maPT+'.'+ req.file.mimetype.substring(6);
                    let newFile = filePath + fileName;
                    fs.readFile(req.file.path, function(err, data) {
                        fs.writeFile(newFile, data, function(err){
                            if (err) {
                                res.send(result.error(2, 'Write file error!'));
                            } else {
                                phutung.set('ANH', fileName);
                                phutung.save('MAPHUTUNG="' +maPT+'"', function(err, row) {
                                    if (err) {
                                        res.send(result.error(1, 'Update image error!'));
                                    } else {
                                        //phutung.set('MAPHUTUNG', maPT);
                                        var reqUrl = url.format({
                                            protocol: req.protocol,
                                            host: req.get('host'),
                                            // pathname: req.originalUrl,
                                        });
                                        fs.unlinkSync(req.file.path);
                                        phutung.set('ANH', reqUrl + '/img/' + fileName);
                                        res.send(result.data(phutung));
                                    }
                                })
                            }
                        })
                    });
                } else {
                    res.send(result.data(phutung));
                }         
            }
        });
    }
});
//sua phu tung
router.put('/:id', upload.single('filetoupload'), function (req, res) {
    console.log(req.body);
    if(req.params.id && req.body.TENPHUTUNG){
        var lastestId = req.params.id;
        phutung.find('first', {where:'MAPHUTUNG="' + lastestId+'"'}, function(err, rowFind) {
            if (err) {
                res.send(result.error(404, 'Data not found!'));
            } else {
                phutung.set('TENPHUTUNG',req.body.TENPHUTUNG);
                phutung.set('ID_DVT',req.body.ID_DVT);
                phutung.set('MOTA_PT',req.body.MOTA_PT);
                if(req.body.THOIGIANBAOHANH)
                phutung.set('THOIGIANBAOHANH',parseInt(req.body.THOIGIANBAOHANH));
                else
                phutung.set('THOIGIANBAOHANH',0);
                if(req.body.MADONGXE!='-1')
                phutung.set('MADONGXE',req.body.MADONGXE);
                phutung.set('MADMPHUTUNG',req.body.MADMPHUTUNG);
                phutung.set('GIABAN',parseInt(req.body.GIABAN));
                phutung.set('ID_NCC',req.body.ID_NCC);
                phutung.save('MAPHUTUNG="' + lastestId+'"', function(err, row){
                    if (err) {
                        res.send(result.error(1, 'DB error!'));
                    } else {
                        if (req.file) {                            
                            //check old image
                            console.log(rowFind.ANH);
                            if (rowFind.ANH) {
                                console.log('có hình');
                                fs.exists(filePath + rowFind.ANH, function(exists) {
                                    if (exists) {
                                        fs.unlinkSync(filePath + rowFind.ANH);
                                    }
                                });
                            }
                            let maPT = req.params.id;
                            let fileName = maPT+'.'+ req.file.mimetype.substring(6);
                            console.log(fileName);
                            let newFile = filePath + fileName;
                            fs.readFile(req.file.path, function(err, data) {
                                fs.writeFile(newFile, data, function(err){
                                    if (err) {
                                        res.send(result.error(2, 'Write file error!'));
                                    } else {
                                        //remove tmp file
                                       // fs.unlink(req.file.path);

                                        phutung.set('ANH', fileName);
                                        phutung.save('MAPHUTUNG="' + maPT+'"', function(err, row) {
                                            if (err) {
                                                res.send(result.error(1, 'Update image error!'));
                                            } else {
                                               // phutung.set('MAPHUTUNG', lastestId);
                                                var reqUrl = url.format({
                                                    protocol: req.protocol,
                                                    host: req.get('host'),
                                                    // pathname: req.originalUrl,
                                                });
                                                phutung.set('ANH', reqUrl + '/img/' + fileName);
                                                res.send(result.data(phutung));
                                            }
                                        })
                                    }
                                })
                            });
                        } else {
                            res.send(result.data(phutung));
                        }         
                    }
                });
            }
            
        })
    }
});
//get phu tung theo id
router.get('/:id',function(req,res){
    phutung.query("SELECT * from phutung pt,donvitinh dvt where pt.ID_DVT=dvt.ID_DVT and pt.MAPHUTUNG='"+req.params.id+"'",function(err,row){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row));
        }
    });
});
//get phu tung theo nha cung cap
router.get('/ncc/:id',function(req,res){
    phutung.query("SELECT * from phutung pt,donvitinh dvt,nhacungcap ncc where pt.ID_NCC=ncc.ID_NCC and pt.ID_DVT=dvt.ID_DVT and pt.ID_NCC="+req.params.id,function(err,row){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(row));
        }
    });
});
//
router.delete('/:id',function(req,res){
    phutung.find('count',{where :"MAPHUTUNG='"+req.params.id+"'"},function(err,kq){
        if(err)
        res.send(err);
        else if (kq>0){   
            phutung.remove("MAPHUTUNG='"+req.params.id+"'",function(err,row){
                    if(err)
                    {
                        res.send(result.error(1,'Database Error !'));
                    }
                    else
                    {
                        res.send(result.error(0,'Delete Successful !'));
                    }
                });
            } else{
                res.send(result.error(3,"Data Not Found !"));
            }
    });
});
router.get('/taoma/maphutung',function(req,res){
    phutung.query("SELECT createMaPhuTung() as MAPHUTUNG",function(err,row,fields){
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