var request = require('sync-request');

// for every URL path that starts with /api/, send request to upstream API service
// var customResolver1 = function(host, url) {
//  if(/^\/api\//.test(url)){
//     return 'http://127.0.0.1:3333';
//  }
// };

// assign high priority
// customResolver1.priority = 100;

var proxy = new require('redbird')({
  port: 8899,
  secure: false,  // for http -> https
  resolvers: [
  // customResolver1,
  // uses the same priority as default resolver, so will be called after default resolver
  function(host, url) {
    var res = request('GET', 'http://example.com');
    console.log(res.getBody().toString());
    console.log(host, url);
    if(/^\/api\/.*$/.test(url)){
      return 'https://dev.test.com';
    }
  }]
})
