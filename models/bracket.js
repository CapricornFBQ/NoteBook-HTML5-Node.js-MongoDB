var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//声明一个数据库 对象
var bracketSchema = new Schema({
    email: String,
    time: {
        date:String,
        year:Number,
        month:String,
        day:String,
        minute:String
    },
    title: String,
    tag: String,
    note:String,
});
//暴露数据模型
module.exports = mongoose.model('bracket', bracketSchema);