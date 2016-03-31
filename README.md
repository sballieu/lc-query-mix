# Create a query mix to benchmark your route planner on top of the dataset of the Belgian railways

 * 2015-10-routeplanning-logs.csv is the raw data as extracted by Colpaert and Chua for their first paper on querylogs for travel flows [1].
 * index.js is a nodejs application which converts this data into query mixes for benchmarking route planners

### Use index.js as follows

_TODO_

## Why the Belgian railways?

It's a fairly simple dataset: it only has around 600 stops with a reasonable amount of departures. Check out more stats at https://github.com/irail/stations.

A second, more important reason, is that the iRail project publishes their own statistics in real-time, under a CC0 license, on what route planning queries are asked. This way, we can come up with a query mix that's close to the real-world, or actually the real-world situation.

## The idea

We make query mixes based on real query logs of the iRail API, which can be downloaded at https://hello.irail.be/query-logs. The real query logs will be transformed into a format that can be used as an input to a benchmark.

We will select data for one hour during peak hours. This "normal" setting is expected to cause a reasonable load on both clients and server, as we were able to handle it on the iRail server. If this is not the case, we should draw our conclusions here.

Then, we also output the next hour, but change the execution moment to the hour before (check the T parameter, which is a time offset: execute this query on this second after start). We repeat this for the rest of the dataset.

So before you use this in a benchmark you might want to:
 * Split this resulting query mix into chuncks which denote the normal load and higher loads using e.g., `node index.js | head -n 1000 > result.jsonstream`
 * Sort the query mix by T (right now it's unsorted)

## References 

[1] Colpaert, P., Chua, A., Verborgh, R., Mannens, E., Van de Walle, R., and Vande Moere, A. (2016). What Public Transit API Logs Tell Us about Travel Flows. WWW '16: 25th International World Wide
Web Conference http://dx.doi.org/10.1145/2872518.2891069
