'use strict';

const http = require('http'),
    connect = require('connect'),
    httpProxy = require('http-proxy'),
    request = require('sync-request');


var proxy = httpProxy.createProxyServer({});
proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('X-Special-Proxy-Header', 'node-proxy');
    
    // 此行要根據你 Target 的 Server 設定而至，如果有多個 Virtual Host 就要考慮設定！
    proxyReq.setHeader('Host', req.host);
    
    // stuff from prev middleware.
    console.log('[Before proxyReq]', req.body, req.body.length);
    proxyReq.write(req.body);
});

var app = connect()
    .use(function(req, res, next){
        var data = [];
        req.on('data', function(chuck){
            data.push(chuck);
        });
        req.on('end', function(){
            var body = Buffer.concat(data);
            console.log('[Start proxyReq]', body, body.length);
            req.body = body;
            
            // config target
            req.prefix = '';
            req.host = 'dev.test.com';
            req.protocal = 'https://';
            
            req.proxyTarget = req.protocal + req.host + req.prefix;
            req.secure = false;
            next();
        });

    })
    .use(function(req, res, next){
        proxy.web(req, res, {
            target: req.proxyTarget,
            secure: req.secure
        });
    });

var port = 5050;
console.log("listening on port " + port);
var server = http.createServer(app).listen(port);

module.exports = server;
