var Transform = require('stream').Transform,
    request = require('request'),
    util = require('util');

util.inherits(ExecuteQueryMixTransform, Transform);

function ExecuteQueryMixTransform () {
  Transform.call(this, {objectMode : true});
  this.T0 = new Date();
}

ExecuteQueryMixTransform.prototype._transform = function (object, encoding, done) {
  if (!object.T) {
    console.log(object);
    done();
  } else {
    var dTms = new Date() - this.T0;
    var waitingTime = (object.T * 1000 - dTms);
    
    var execute = function () {
      request('http://localhost', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        } else {
          console.log('Server can\'t handle it anymore' , error, response.statusCode);
        }
      });
      console.log(dTms/1000);
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
