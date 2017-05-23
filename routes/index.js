var crypto = require('crypto'),
  markdown = require('markdown').markdown,
  User = require('../models/user.js'),
  Note = require('../models/note.js'),
  Tag = require('../models/tag.js'),
  Bracket = require('../models/bracket.js'),
  ObjectId = require('mongodb').ObjectId;  // 这里及其重要，主要用于后面查_id时，用于解析前面传过来对应文章的id字符串！！！！！

module.exports = function(app) {
  //进入首页面===========================================================================================================================
  app.get('/', function(req, res) {
    res.render('index', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  //关于注册信息提交=======================================================================================================================
  app.post('/regInformation', checkNotLogin);
  app.post('/regInformation', function(req, res) {
     var email = req.body.email,
        password = req.body.password;
        //生成密码的md5值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
          email: req.body.email,
          password: password,
        });
        //检查用户名是否已经存在
        User.findOne({"email":req.body.email}, function(err, user) {
          if (user) {
            req.flash('error', '用户已经存在！请更换其他用户名');
            return res.redirect('/'); //返回注册页
          } else {
            //如果不存在则新增用户
            User.create(newUser,function (err, user) {
              if (err) {
                return err;
              }
              req.session.user = newUser; //用户信息存入session
              req.flash('success', '注册成功！');
              return res.redirect('/note'); //注册成功后进入笔记页面
            });
          }
      });
  });
  //关于登录验证===========================================================================================================================
  app.post('/login', checkNotLogin)
  app.post('/login', function(req, res) {
    //生成密码的md5值
    var md5 = crypto.createHash('md5'),
       password = md5.update(req.body.password).digest('hex');
       //检查用户是否存在
       User.findOne({
         email:req.body.email,
         password:password
        }, function(err, user) {
         if (err) {
           return  err;
         }
         if(user) {
          //用户名密码都匹配后，将用户信息存入session,这个用户信息包含所有的储存在数据库中的user相关的信息
          req.session.user = user;        //包含用户的密码、email
          req.flash('success', '登录成功！');
          return res.redirect('/note');//登录成功后，跳转到笔记页面
         }else {
            req.flash('error', '用户名或密码错误！');
            return res.redirect('/'); //密码错误跳转到起始页
         }
      });
  });
  //关于email的Ajax验证=======================================================================================================================
  app.get('/email', checkNotLogin);
  app.get('/email', function(req, res) {
    var email = req.query.email;
    console.log(email);
    User.findOne({"email":email}, function(err, user) {
      console.log(user);
      if (user) {
        return res.send({"exist":true}); //如果有该用户名，返回值为true；
      }else {
        return res.send({"exist":false}); //如果user为null 则返回false
      }
    });
  })
  //向浏览器输出note页面=======================================================================================================================
  app.get('/note', checkLogin);
  app.get('/note', function(req, res) {
    res.render('note', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })
  //向浏览器输出笔记编辑页面=====================================================================================================================
  app.get('/newNote', checkLogin);
  app.get('/newNote', function(req, res) {
    res.render('newNote', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })
  //向服务器传入笔记内容=========================================================================================================================
  app.post('/newNoteInformation', checkLogin);
  app.post('/newNoteInformation', function(req, res) {
    var currentUser = req.session.user,  //调取session中的用户对象
    tag = req.body.tag,     //在路由加入标签的形式，对存入的文章进行分类
    title = req.body.title, 
    note = req.body.newNote,
    date = new Date();
    //存储各种时间格式， 方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-"+ (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    }
    note = {
      email:currentUser.email, 
      time:time,
      title:title, 
      tag:tag, 
      note:note,
    }    //1.用户名以及头像需要跟随存入文章，后面提取文章时方便，不需要再次调用user数据库
    Note.create(note, function(err) {
      if(err) {
        req.flash('error' ,err);
        return res.send({"result": false});
      };
      req.flash('success', '发布成功！');
      return res.send({"result": true});
    });
  })
  //向浏览器输出全部笔记的目录页面=====================================================================================================================
  app.get('/allNotes', checkLogin);
  app.get('/allNotes', function(req, res) {
    //需要先判断是否为第一页，并把请求的页数转化为number类型
    console.log(req.query.p)
    //如果req.query.p未定义，则page=1
    var currentpage = req.query.p ? parseInt(req.query.p) : 1;
    //定义查询条件tag为“coding”
    var email = req.session.user.email;
    console.log(email);
    var skip = 8 * (currentpage - 1);
    Note.count({"email":email}, function(err, total) {
      if (err) {
        notes = [];
      }
      //查询并返回第page页的五篇文章 !!!!!同时只显示coding标签的内容
      Note.find({"email":email}).skip(skip).limit(8).sort({"-createtime": -1}).exec(function (err, notes) {
        if (err) {
          notes = [];
        }
        //数据转化为markdown格式；
        notes.forEach(function(doc) {
            if (doc) {
                doc.note = markdown.toHTML(doc.note);
            }
        });
        var pagesize = 8;
        res.render('allNotes', {
          currentpage: currentpage, //当前页码
          pagesize: pagesize,       //每一页的显示数
          total: total,             //总文档数
          user: req.session.user,
          notes: notes,  
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
          });
      });
    });
  })
  //退出登录===================================================================================================================================
  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '成功退出~');
    return res.redirect('/');//退出成功后跳转到首页
  });
  //检测用户是否登录============================================================================================================================
  // 对用户是否登录做出权限分类，登录的用户不可 打开注册和登录页面
  //未登录的用户不可打开发表文章的页面
  // 先检测用户是否登录：
  function checkLogin(req, res, next) {
    if(!req.session.user) {                   
      req.flash('error', '您未登录！');
      return res.redirect('/');
    }
    next();
  }
  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '您已登录！');
      return res.redirect('back'); //返回之前的页面
    }
    next();
  }
}