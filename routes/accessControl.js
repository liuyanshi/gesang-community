function requiredNotLogin(req, res, next) {
    // !undefined -> true
    if (req.session.user) {
        // 这边使用跳出提示比较好;
        // TODO 2016 年02月02日11: 59: 10 以及登录之后回到原来的页面
        console.log('error已登录!');
        //return res.redirect('back');//返回之前的页面,这边可能会出现重定向
        return res.redirect('/');//返回之前的页面,这边可能会出现重定向
        //console.log('测试redirect之后的语句是否执行');
    }
    console.log("****** 检测用户状态: 未登录");

    next();
}

function requiredLogin(req, res, next) {

    if (!req.session.user) {
        req.flash('error', '未登录!');
        return res.redirect('/user/login-register');
    }
    console.log("******检测用户状态: 已登录");
    next();
}

module.exports = {
    requiredNotLogin: requiredNotLogin,
    requiredLogin: requiredLogin
};