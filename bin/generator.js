#!/usr/bin/node
var csv = require('fast-csv'),
    fs = require('fs'),
    moment = require('moment');

var stream = fs.createReadStream("2015-10-routeplanning-logs-sorted.csv");

//start time
var t0 = moment("2015-10-01T16:00:00+01:00");

var interval = 15*60; // 15 minutes

var csvStream = csv({headers:true})
    .on("data", function(data) {
      data.datetime = moment(data.datetime);
      if (data.requested_datetime) {
        data.requested_datetime = moment(data.requested_datetime);
      }
      if (data.datetime >= t0) {
        var object = {};
        var delta = (data.datetime - t0)/1000; //in seconds
        object.T =  delta % interval; //When to execute a request
        object.round = Math.round(delta / interval); //the amount of intervals we are running in front
        object.departureStop = data.from_id;
        object.arrivalStop = data.to_id;        
        //Round the departure time by minute
        object.departureTime = new Date(Math.round(((data.requested_datetime || data.datetime) - object.round * interval * 1000)/1000)*1000);
        object.originalDepartureTime = data.requested_datetime || data.datetime;
        if (object.departureTime) {
          console.log(JSON.stringify(object));
        }
      }
    })
    .on("end", function() {
      
    });

stream.pipe(csvStream);
