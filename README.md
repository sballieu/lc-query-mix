# Create a query mix to benchmark your route planner on top of the dataset of the Belgian railways

 * 2015-10-routeplanning-logs.csv is the raw data as extracted by Colpaert and Chua for their first paper on querylogs for travel flows [1].
 * bin/generator.js is a nodejs application which converts this data into query mixes for benchmarking route planners

**This code is only generating the query mixes for a different repository: https://github.com/pietercolpaert/belgianrail-query-load**

### Use bin/generate.js as follows

```bash
node bin/generate.js | sort -n -t: -k2 > results.jsonstream
```

This will give you newline delimited json query object in a file result.jsonstream.

If you want to put these in buckets, we wrote a script at `bin/bucketize.sh` which does this exactly: it will split the query mix over different files.

```
./bin/bucketize.sh 100 queries/ < results.jsonstream
```

## Why the Belgian railways?

It's a fairly simple dataset: it only has around 600 stops with a reasonable amount of departures. Check out more stats at https://github.com/irail/stations.

A second, more important reason, is that the iRail project publishes their own statistics in real-time, under a CC0 license, on what route planning queries are asked. This way, we can come up with a query mix that's close to the real-world, or actually the real-world situation.

## The idea

We make query mixes based on real query logs of the iRail API, which can be downloaded at https://hello.irail.be/query-logs. The real query logs will be transformed into a format that can be used as an input to a benchmark.

## References 

[1] Colpaert, P., Chua, A., Verborgh, R., Mannens, E., Van de Walle, R., and Vande Moere, A. (2016). What Public Transit API Logs Tell Us about Travel Flows. WWW '16: 25th International World Wide Web Conference http://dx.doi.org/10.1145/2872518.2891069
