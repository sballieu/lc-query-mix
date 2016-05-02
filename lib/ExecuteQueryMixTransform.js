var Transform = require('stream').Transform,
    request = require('request'),
    LCClient = require('lc-client'),
    util = require('util');

util.inherits(ExecuteQueryMixTransform, Transform);

function ExecuteQueryMixTransform () {
  Transform.call(this, {objectMode : true});
  this.T0 = new Date();
  this.client = new LCClient({entrypoints:['http://belgianrail.linkedconnections.org/connections/']});
  this.streams = [];
  this.requestCount = 0;
  this.resultCount = 0;
  this.queriesCount = 0;
  this.responseCount = 0;
}

ExecuteQueryMixTransform.prototype._transform = function (object, encoding, done) {
  if (typeof object.T === "undefined") {
    console.log(object);
    done();
  } else {
    var dTms = new Date() - this.T0;
    var waitingTime = (object.T * 1000 - dTms);
    var self = this;
    var execute = function () {
      console.log('Time elapsed: ' + dTms/1000);
      console.log('HTTP requests: ' + self.responseCount + '/' + self.requestCount);
      console.log('Results/Queries: ' + self.resultCount + '/' + self.queriesCount);
      object.departureStop = object.departureStop.replace('http://irail.be/stations/NMBS/00','');
      object.arrivalStop = object.arrivalStop.replace('http://irail.be/stations/NMBS/00','');
      //console.log(object);
      /*request('http://localhost', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        } else {
          console.log('Server can\'t handle it anymore' , error, response.statusCode);
        }
        });*/
      self.client.query(object, function (resultStream, source) {
        self.queriesCount ++;
        source.on('request', function (url) {
          self.requestCount ++;
          console.log('Request: ' + url);
        });
        source.on('response', function (url) {
          self.responseCount ++;
          console.log('Response: ' + url);
        });
        var resultFound = false;
        resultStream.on('result', function (path) {
          //console.error('result found for ', object);
          resultFound = true;
          self.resultCount ++;          
          source.close();
        });
        resultStream.on('data', function (data) {
        });
        source.on('error', function (e) {
          console.error(e);
        });
        
        resultStream.on('error', function (e) {
          console.error(e);
        });
        resultStream.on('end', function () {
          if (!resultFound) { 
            console.error('No result found for ', object);
            //No result is also a result
            self.resultCount++;
          }
        });
      });
      
      done();
    }
    
    if (waitingTime > 0) {
      setTimeout(execute, waitingTime);
    } else {
      execute();
    }
  }
}

module.exports = ExecuteQueryMixTransform;