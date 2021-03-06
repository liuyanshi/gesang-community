var express = require('express');
var router = express.Router();
var Article = require('../models/article');

router.get('/', function (req, res, next) {
    // 判断是否是第一页,并且把请求的页数转换为number类型
    var page = req.query.page ? parseInt(req.query.page) : 1;
    // 查询并返回第page页面的10篇文章
    // 这里通过 req.query.page 获取的页数为字符串形式,我们需要通过 parseInt() 把它转换成数字以作后用
    // Article.getTen = function (author, page, callback) {}
    Article.getTen(null, page, function (err, articles, total) {
        if (err) articles = [];
        res.render('articles', {
            articles: articles,
            page: page,
            isFirstPage: (page - 1) === 0,
            isLastPage: ((page - 1) * 10 + articles.length) === total,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    //Article.getAll(null, function (err, articles) {
    //    if (err) articles = [];
    //    res.render('articles', {
    //        user: req.session.user,
    //        articles: articles,
    //        success: req.flash('success').toString(),
    //        error: req.flash('error').toString()
    //    });
    //
    //});
});

router.get('/archive', function (req, res) {
    Article.getArchive(function (err, articles) {
        if (err) {
            console.log('==[Error] in routes/articles/archive :' + err);
            req.flash('error', err);
            res.redirect('/articles');
        }
        console.log('==[Error] 归档的大小' + articles.length);
        res.render('archive', {
            articles: articles,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('err').toString()
        });
    });
});

router.get('/tags', function (req, res) {
    Article.getTags(function (err, tags) {
        if (err) {
            console.log('==[Error] in routes/articles/tags :' + err);
            req.flash('error', err);
            res.redirect('/articles');
        }
        res.render('tags', {
            tags: tags,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});

router.get('/tag/:tag', function (req, res) {
    Article.getTag(req.params.tag, function (err, articles) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        res.render('tag', {
            articles: articles,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

});
module.exports = router;