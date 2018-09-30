var express=require('express');
var router=express.Router();
var Db=require('../modules/db');
var result=require('../modules/response-result');
var DongXe=Db.extend({tableName:"dongxe"});
var dongxe=new DongXe();
var HangXe=Db.extend({tableName:"hangxe"});
var hangxe=new HangXe();
router.get('/taoma/madongxe',function(req,res){
    dongxe.query("SELECT createMaDongXe() as MADONGXE",function(err,row,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(row));
        }
    });
});
//tu dong xe=>thong tin hang xe
router.get('/seach/:id',function(req,res){
    dongxe.query("SELECT * from dongxe dx, hangxe hx where hx.MAHANGXE= dx.MAHANGXE and dx.MADONGXE='"+req.params.id+"'"
    ,function(err,rows){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(rows));
        }
    });
});
//get dong xe theo ma hang xe
router.get('/mahangxe/:id',function(req,res){
    dongxe.find('all',{where: "MAHANGXE = '"+req.params.id+"'"},function(err,rows){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/hangxe',function(req,res){
    hangxe.find('all',function(err,rows){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/dongxe',function(req,res){
    dongxe.find('all',function(err,rows){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        }else
        {
            res.send(result.data(rows));
        }
    });
});
module.exports =router;