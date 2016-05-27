var request = require('request');
target_url = process.env.ATS_URL;
if ( !target_url ) {
  target_url = 'http://127.0.0.1:9615/';
} 
exports.collect = function(cb){
  request(target_url, {timeout:1000}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data = JSON.parse(body);
      var out = [];
      //res.set('Content-Type', 'text/plain');
      for (var index in data.processes ){
        var obj = data.processes[index];
        var name = obj.name;
        var cpu = obj.monit.cpu;
        var mem = obj.monit.memory;
        var restart = obj.pm2_env.restart_time;
        var up = obj.pm2_env.status=="online"?1:0;
        name=name.replace(/\-/g, '_');
        name=name.replace(/\W/g, '_');
        out["pm2."+name+".cpu"] = cpu;
        out["pm2."+name+".memory"] = mem;
        out["pm2."+name+".restart"] = restart;
        out["pm2."+name+".online"] = up;
        for (var m in obj.pm2_env.axm_monitor) {
          if (m != "Loop delay") {
            metric = obj.pm2_env.axm_monitor[m];
            m=m.replace(/\-/g, '_');
            m=m.replace(/\W/g, '_');
            value = parseFloat(metric.value);
            out["pm2."+name+"."+m] = value;
          }
        }
      }
      cb(out); 
    }
  });
}
