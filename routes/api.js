var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    if(req.query && req.query.callback){
        res.jsonp({
            status:200,
            message:'JSONP_API',
            data:[]
        });
    }else{
        res.json({
            status:200,
            messages:'JSON_API',
            data:[]
        })
    }
})

module.exports = router;
