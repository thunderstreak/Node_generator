var express = require('express');
var router = express.Router();
var app = express();

// 导入Mysql模块
var mysql = require('mysql');
var dbConfig = require('../DB/DBConfig.js');
var userSQL = require('../DB/usersql.js');

// 使用DBConfig.js的配置信息创建一个连接池
var pool = mysql.createPool(dbConfig.mysql);

// 响应一个JSON数据
var responseJSON = function(res,ret){
    if(typeof ret === 'undefined'){
        res.json({
            code:214,
            msg:'操作失败!'
        });
    }else{
        res.json(ret);
    }
}

// 添加用户
router.get('/addUser',function(req,res,next){
    // 从连接池获取连接
    pool.getConnection(function(err,connection){
        // 获取前台页面传递过来的参数
        var param = req.query || req.params;
        if(JSON.stringify(param) == '{}'){
            result = {
                code:414,
                msg:'没有输入用户值'
            }
            // 以json形式返回操作结果
            responseJSON(res,result);
        }else{
            // 创建连接，增加一个用户信息
            connection.query(
                userSQL.insert,
                [param.user,param.pass],
                function(err,result){
                    if(result){
                        result = {
                            code:200,
                            msg:'增加成功'
                        }
                    }

                    // 以json形式返回操作结果
                    responseJSON(res,result);
                    // 释放连接
                    connection.release();
                }
            )
        }

    })
})

// 查询用户
router.get('/selectUser',(req,res,next)=>{
    pool.getConnection((err,connection)=>{
        let param = req.query || req.params;
        if(JSON.stringify(param) == '{}'){
            result = {
                code:414,
                msg:'没有输入用户值'
            }
            // 以json形式返回操作结果
            responseJSON(res,result);
        }else {
            connection.query(
                userSQL.getUserById,
                [param.user,param.pass],
                (err,result)=>{
                    // 没有查询到数据
                    console.log('/-'+err);
                    if(result.length==0){
                        responseJSON(res,{
                            code:213,
                            msg:'用户不存在!'
                        });
                        return;
                    }

                    let resultData;
                    console.log(result[0]);
                    if(result[0].user == param.user && result[0].pass == param.pass){
                        resultData={
                            code:200,
                            msg:'登录成功!',
                            data:result[0]
                        }
                    }else{
                        resultData={
                            code:201,
                            msg:'用户名或密码错误',
                            data:result
                        }
                    }
                    // 以json形式返回操作结果
                    responseJSON(res,resultData);
                    // 释放连接
                    connection.release();
                }
            )
        }
    })
})

router.post('/login',(req,res,next)=>{
    console.log(0);
    console.log(req.body);
    if(req.body.user==123 && req.body.pass=='123'){
        resultData={
            code:200,
            msg:'登录成功!',
            data:req.body
        }
        // 以json形式返回操作结果
        responseJSON(res,resultData);
    }else{
        resultData={
            code:201,
            msg:'用户名或密码错误',
            data:req.body
        }
        responseJSON(res,resultData);
    }
})

module.exports = router;
