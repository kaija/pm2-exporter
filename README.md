# pm2-exporter
metrics exporter for pm2

### Getting start

```bash
npm start
```

```bash
pm2 start bin/exporter
```

### Configuration

```json
{
    "prepend_hostname": true,         // Append hostname before metrics
    "debug": false,                   // dump metrics
    "statsd_addr": "127.0.0.1",       // statsd server url
    "statsd_port": 8125,              // statsd port
    "schedule": "0 * * * * * *"       // report cron job string
}
```

### Graphite 

Metrics.stats.gauges.$metrics

### Prometheus

```bash
curl http://localhost:9199/metrics
```

### enable pmx metrics


Reference pmx metrics
https://github.com/keymetrics/pmx


