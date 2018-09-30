var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var DanhMucPhuTung=Db.extend({tableName:"tgr_danh_muc_phu_tung"});
var danhmucphutung=new DanhMucPhuTung();

router.get('/', function(req,res) {
    //console.log('test');
    danhmucphutung.query("SELECT dm.*, dv.ten AS ten_dich_vu from tgr_danh_muc_phu_tung dm LEFT JOIN tgr_don_vi_lam_viec dv ON dm.donvi_id=dv.id",function(err,rows,fields){
        if(err) {
            console.log(err);
            res.send(result.error(1,"Database Error !"));
        } else {
            res.send(result.data(rows));
        }
    });
});

router.get('/:id', function(req,res){
    danhmucphutung.find('first', { where: "id = '"+req.params.id+"'" }, function(err,row) {
        if(err) {
            res.send(result.error(1,"Database Error !"));
        } else {
            res.send(result.data(row));
        }
    });
});

router.post('/', function(req, res){
    //console.log(req.body);
    if(req.body.donvi_id && req.body.ten){
        danhmucphutung.set('ten',req.body.ten);
        danhmucphutung.set('mo_ta',req.body.mo_ta);
        danhmucphutung.set('donvi_id',req.body.donvi_id);
        danhmucphutung.save(function(err, row) {
            if(err) {
                res.send(result.error(1,"Database Error !"));
            } else {
                res.send(result.data(row));
            }
        });

    } else {
        res.send(result.error(2,"Missing field"));
    }
});

router.put('/',function(req,res){
    //console.log(req.body);
    if(req.body.id && req.body.ten) {
        danhmucphutung.set('ten',req.body.ten);
        danhmucphutung.set('mo_ta',req.body.mo_ta);

        if(req.body.donvi_id) 
            danhmucphutung.set('donvi_id',req.body.donvi_id); 
        else 
            danhmucphutung.set('donvi_id',null);
        
        danhmucphutung.save("id='"+req.body.id+"'", function(err,row) {
            if(err) {
                res.send(result.error(1,"Database Error !"));
            } else {
                res.send(result.data(danhmucphutung));
            }
        });
    }
    else{
        res.send(result.error(2,"Missing field"));
    }
});

router.delete('/:id',function(req,res) {
    danhmucphutung.find('count',{where :'id="'+req.params.id+'"'}, function(err,kq) {
        if(err) res.send(err);
        else if (kq>0) {   
            danhmucphutung.remove('id="'+req.params.id+'"',function(err,row) {
                if(err) 
                    res.send(result.error(1,'Database Error !'));
                else
                    res.send(result.error(0,'Delete Successful !'));
            });
        } else {
            res.send(result.error(3,"Data Not Found !"));
        }
    });
});

// router.get('/taoma/id',function(req,res){
//     danhmucphutung.query("SELECT createid() as id",function(err,row,fields){
//         if(err) 
//             res.send(result.error(1,"Database Error !"));
//         else
//             res.send(result.data(row));
//     });
// });

module.exports =router;