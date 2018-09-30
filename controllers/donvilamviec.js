var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var DonVi=Db.extend({tableName:"tgr_don_vi_lam_viec"});
var donvi=new DonVi();

router.get('/',function(req,res) {
    donvi.find('all',function(err,rows,fields) {
        if(err) {
            console.log(err);
            res.send(result.error(1,"Database Error !"));
        } else {
            res.send(result.data(rows));
        }
    });
});

router.get('/:id',function(req,res){
    donvi.find('first',{where: "id = '"+req.params.id+"'"},function(err,row) {
        if(err)
            res.send(result.error(1,"Database Error !"));
        else
            res.send(result.data(row));
    });
});

router.post('/', function(req, res){
    if(req.body.id && req.body.ten) {
        donvi.set('id',req.body.id);
        donvi.set('ten',req.body.ten);
        donvi.set('mo_ta',req.body.mo_ta);

        donvi.save(function(err, row) {
            if(err)
                res.send(result.error(1,"Database Error !"));
            else
                res.send(result.data(donvi));
        });
    } else {
        res.send(result.error(2,"Missing field"));
    }
});

router.put('/',function(req,res) {
    if(req.body.ten) {
        donvi.set('ten',req.body.ten);
        donvi.set('mo_ta',req.body.mo_ta);

        donvi.save("id='"+req.body.id+"'",function(err,row) {
            if(err)
                res.send(result.error(1,"Database Error !"));
            else
                res.send(result.data(donvi));
       });
    }
    else {
        res.send(result.error(2,"Missing field"));
    }
});

// router.get('/taoma/id',function(req,res) {
//     donvi.query("SELECT createid() as id",function(err,row,fields) {
//         if(err)
//             res.send(result.error(1,"Database Error !"));
//         else
//             res.send(result.data(row));
//     });
// });

router.delete('/:id',function(req,res) {
    donvi.find('count',{where :'id="'+req.params.id+'"'},function(err,kq) {
        if(err)
            res.send(err);
        else if (kq>0){   
            donvi.remove('id="'+req.params.id+'"',function(err,row) {
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

module.exports =router;