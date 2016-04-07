#!/usr/bin/node
var csv = require('fast-csv'),
    fs = require('fs'),
    moment = require('moment'),
    program = require('commander');

console.error("Queyr mix generator use --help to discover more functions");

var config;

program
    .version('0.1.0')
    .option('-f --filter [string]', 'filter on user agent')
    .arguments('<configFile>')
    .action(function (query) {
        try {
            query = fs.readFileSync(query, { encoding: 'utf8' });
        } catch (error) {
            console.error(error);
        }
        config = JSON.parse(query);
    })
    .parse(process.argv);

if (!config) {
    console.error('Please provide a config file.');
    process.exit();
}

var user_agent_filter = program.filter|| "";
user_agent_filter = user_agent_filter.toLowerCase();

var stream = fs.createReadStream(config.queries_file);

//start time
var t0 = moment(config.start_time);

var csvStream = csv({headers:true})
    .on("data", function(data) {
      data.datetime = moment(data.datetime);
      if (data.requested_datetime) {
        data.requested_datetime = moment(data.requested_datetime);
      }
      if (data.datetime >= t0 && data.user_agent.toLowerCase().indexOf(user_agent_filter) > -1) {
        var object = {};
        var delta = (data.datetime - t0)/1000; //in seconds
        object.T =  delta % 3600; //When to execute a request
        object.departureStop = data.from_id;
        object.arrivalStop = data.to_id;
        //Round the departure time by minute
        object.departureTime = new Date(Math.round(((data.requested_datetime || data.datetime) - delta * 1000)/1000)*1000);
        object.originalDepartureTime = data.requested_datetime || data.datetime;
        console.log(JSON.stringify(object));
      }
    })
    .on("end", function() {
      
    });

stream.pipe(csvStream);
