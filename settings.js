//保存该博客的配置信息（比如数据库的链接信息）

module.exports = {
    cookieSecret: 'myblog', //该项用于cookie加密，与数据库无关
    mongodbUrl:'mongodb://localhost:27000/db', //mongoose链接的url
    webport: 3000  //网站端口号
};