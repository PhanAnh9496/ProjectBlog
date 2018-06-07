var express = require('express');
var multer = require('multer');
var ImgArr = [];
var mongoose = require('mongoose');
var ContactModel = require('../models/posts');
var router = express.Router();
mongoose.connect('mongodb://localhost/product');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/imgproduct')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({
    storage: storage
});

/* GET home page. */
router.get('/', function (req, res, next) {
    ContactModel.find({}, function(err, jsonProduct){
        res.render('index', {
            title: 'Home',
            data: jsonProduct
        });
    });   
});

/* Trang About. */
router.get('/about.html', function (req, res, next) {
    res.render('about', {
        title: 'About'
    });
});

/* Trang Bài Viết. */
router.get('/post.html/:idCanPost', function (req, res, next) {
    var idPost = req.params.idCanPost;
    ContactModel.find({_id: idPost}, function(err, jsonProduct){
        res.render('post', {
            title: 'Post',
            data: jsonProduct
        });
    }); 
});

/* Trang Contact. */
router.get('/contact.html', function (req, res, next) {
    res.render('contact', {
        title: 'Contact'
    });
});
/* --------- Xu Ly Phan Admin. --------- */
/* Trang Thêm Dữ Liệu. */
router.get('/them.html', function (req, res, next) {
    res.render('them', {
        title: 'Them Du Lieu'
    });
});

/* POST uploadfile. */
router.post('/uploadfile', upload.any() ,function (req, res, next) {
    var ImgArrName = req.files[0].path;
    ImgArr.push(ImgArrName);
    res.status(200).send(req.files);
});

/* POST Admin. */
router.post('/them.html', function (req, res, next) {
    var titleProduct = req.body.titleProduct;
    var Description = req.body.Description;
    var contentProduct = req.body.contentProduct;
    //Định nghĩa đối tượng để insert vào CSDL
    var OneObject = {
        titleProduct: titleProduct,
        anh: ImgArr,
        Description: Description,
        contentProduct: contentProduct
    };
    //Kết nối với model.
    var dataProduct = new ContactModel(OneObject);
    dataProduct.save();
    res.redirect('/admin.html');
});

/* Trang Admin. */
router.get('/admin.html', function (req, res, next) {
    ContactModel.find({}, function(err, jsonProduct){
        res.render('admin', {
            title: 'Admin',
            data: jsonProduct
        });
    });    
});

/* Phan Xoa Du Lieu. */
router.get('/xoa/:idcanxoa', function (req, res, next) {
    var id = req.params.idcanxoa;
    ContactModel.findByIdAndRemove(id).exec();
    res.redirect('/admin.html')
});

/* Phan Sua Du Lieu. */
router.get('/sua.html/:idcansua', function (req, res, next) {
    var idEdit = req.params.idcansua;
    ContactModel.find({_id: idEdit}, function(err, jsonProduct){
        res.render('sua',{
            title: 'Sua Du Lieu',
            data: jsonProduct
        });
    });
});

/* Post Phan Sua Du Lieu. */
router.post('/sua.html/:idcansua', function (req, res, next) {
    var idEdit = req.params.idcansua;

    ContactModel.findById(idEdit, function (err, jsonProduct) {
        if (err) return handleError(err);
        jsonProduct.titleProduct = req.body.titleProduct;
        jsonProduct.Description = req.body.Description;
        jsonProduct.anh = req.body.anh;
        jsonProduct.contentProduct = req.body.contentProduct;
        jsonProduct.save();
        res.redirect('/admin.html');
    });
});

module.exports = router;