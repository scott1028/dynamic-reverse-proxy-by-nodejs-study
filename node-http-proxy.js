'use strict';

const http = require('http'),
    connect = require('connect'),
    httpProxy = require('http-proxy'),
    request = require('sync-request');


var proxy = httpProxy.createProxyServer({});
proxy.on('proxyReq', function(proxyReq, req, res, options) {
    console.log('step-3');
    proxyReq.setHeader('X-Special-Proxy-Header', 'node-proxy');
    
    // stuff from prev middleware.
    console.log(req.body, req.body.length);
    proxyReq.write(req.body);
});

var app = connect()
    .use(function(req, res, next){
        var data = [];
        req.on('data', function(chuck){
            data.push(chuck);
        });
        req.on('end', function(){
            console.log('step-1');
            var body = Buffer.concat(data);
            req.body = body;
            console.log(body);
            req.proxyTarget = 'https://dev.test.com';
            req.secure = false;
            next();
        });

    })
    .use(function(req, res, next){
        console.log('step-2');
        proxy.web(req, res, {
            target: req.proxyTarget,
            secure: req.secure
        });
    });

var port = 5050;
console.log("listening on port " + port);
var server = http.createServer(app).listen(port);
