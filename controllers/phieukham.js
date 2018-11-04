let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../modules/db');
let response = require('../modules/response-result');
let phieukiemtra = mysql.createConnection(config);

router.get('/loaiphieu/:id',function(req,res){
    phieukiemtra.query("SELECT * from tgr_phieu_kiem_tra pkt, tgr_xe xe, tgr_dong_xe dx WHERE pkt.trang_thai <> '2' and pkt.id_xe = xe.id and xe.id_dong_xe = dx.id ",function(err,rows,fields){
        if(err) {
            res.response(result.error(1,"Database Error !"));
        } else {
            res.response(result.data(rows));
        }
    });
});
//get phieu kiem tra sua chữa theo xe-tiep nhan sua chua
router.get('/xe/:id',function(req,res){
    phieukiemtra.query("SELECT * from phieukiemtra pkt,xe x,dongxe dx WHERE pkt.MAXE=x.MAXE and x.MADONGXE=dx.MADONGXE and x.MAXE='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            console.log(rows);
            res.send(result.data(rows));
        }
    });
});
router.get('/nhanvien/:id',function(req,res){
    phieukiemtra.query("SELECT * from phieukiemtra pkt,chitiet_pk_nv ct,nhanvien nv where nv.MANHANVIEN=ct.MANHANVIEN and pkt.ID_PHIEUKHAM =ct.ID_PHIEUKHAM and pkt.ID_PHIEUKHAM='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
router.get('/xe-khachhang/:id',function(req,res){
    phieukiemtra.query("SELECT * from phieukiemtra pkt,xe x,khachhang kh,dongxe dx where dx.MADONGXE=x.MADONGXE and pkt.MAXE=x.MAXE and kh.MAKHACHHANG=x.MAKHACHHANG and pkt.ID_PHIEUKHAM='"+req.params.id+"'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
// router.get('/xe/:id',function(req,res){
//     xe.find('first',{where: "MAXE = '"+req.params.id+"'"},function(err,row){
//         if(err)
//         {
//             res.send(result.error(1,"Database Error !"));
//         }else
//         {
//             res.send(result.data(row));
//         }
//     });
// });
router.post('/', function(req, res){
    console.log(req.body);
    if(req.body.MAXE){
        phieukiemtra.set('MAXE',req.body.MAXE);
        phieukiemtra.set('NGAYLAPPHIEU',req.body.NGAYLAPPHIEU);
        phieukiemtra.set('YEUCAUKIEMTRA',req.body.YEUCAUKIEMTRA);
        phieukiemtra.set('NOIDUNGKHAM',req.body.NOIDUNGKHAM);
        phieukiemtra.set('TRANGTHAIPK','1');
        phieukiemtra.save(function(err, row){
            if(err){
                res.send(result.error(1,"Database Error !"));
            }else {
                for(let i of req.body.NHANVIEN)
                {
                    console.log(row);
                    chitiet_pk_nv.set('MANHANVIEN',i.MANHANVIEN);
                    chitiet_pk_nv.set('ID_PHIEUKHAM',row.insertId);
                    chitiet_pk_nv.save(function(err, row){});
                }
                res.send(result.data(row));
            }
        });
    }else{
        res.send(result.error(2,"Missing field"));
    }
});
// router.put('/:id',function(req,res){
//     if(req.body.MAxe && req.body.TENxe)
//     {
//         xe.set('TENxe',req.body.TENxe);
//         xe.set('MOTAxe',req.body.MOTAxe);
//         xe.set('MAHANGXE',req.body.MAHANGXE);
//         xe.set('TRANGTHAI_DX',req.body.TRANGTHAI_DX);
//         xe.save("MAxe='"+req.params.id+"'",function(err,row){
//             if(err){
//                 res.send(result.error(1,"Database Error !"));
//             }else {
//                 res.send(result.data(xe));

//             }
//        });
//     }
//     else{
//         res.send(result.error(2,"Missing field"));
//     }
// });
router.post('/phieukham/xacnhan', function(req, res){
    phieukiemtra.set('TRANGTHAIPK',req.body.TRANGTHAIPK);
    phieukiemtra.save("ID_PHIEUKHAM="+req.body.ID_PHIEUKHAM,function(err,row){
        if(err){
            res.send(result.error(1,"Database Error !"));
        }else {
            res.send(result.data(row));

        }
   });
});
//lay hey nhung nhan vien dang lam viec-khong the phan nhiem vu tiep theo
router.get('/phieukham/nhanvien/danglamviec',function(req,res){
    chitiet_pk_nv.query("SELECT * from chitiet_pk_nv ct WHERE ct.TRANGTHAICV='0'",function(err,rows,fields){
        if(err)
        {
            res.send(result.error(1,"Database Error !"));
        } else
        {
            res.send(result.data(rows));
        }
    });
});
module.exports =router;