var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
target_url = process.env.ATS_URL;
if ( !target_url ) {
  target_url = 'http://127.0.0.1:9615/';
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/metrics', function(req, res, next) {
  request(target_url, {timeout:1000}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data = JSON.parse(body);
      var out = "";
      //res.set('Content-Type', 'text/plain');
      for (var index in data.processes ){
         var obj = data.processes[index];
         var name = obj.name;
         var cpu = obj.monit.cpu;
         var mem = obj.monit.memory;
         var restart = obj.pm2_env.restart_time;
         var up = obj.pm2_env.status=="online"?1:0;
         out += "pm2_"+name+"_cpu " + cpu + "\n";
         out += "pm2_"+name+"_memory " + mem + "\n";
         out += "pm2_"+name+"_restart " + restart + "\n";
         out += "pm2_"+name+"_online " + up + "\n";
         for (var m in obj.pm2_env.axm_monitor) {
           if (m != "Loop delay") {
             metric = obj.pm2_env.axm_monitor[m];
             m=m.replace(/\-/g, '_');
             out += "pm2_"+name+"_"+m+" " +metric.value;
           }
         }
      }
      res.set('Content-Type', 'text/plain');
      res.send(out);
    }
  });
});

module.exports = router;
