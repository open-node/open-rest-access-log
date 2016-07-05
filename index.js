var morgan            = require('morgan');
var moment            = require('moment');
var assert            = require('assert-plus');
var FileStreamRotator = require('file-stream-rotator');


module.exports = function(logpath, dateTimeFormat, logFormat) {
  assert.string(logpath, 'logpath');
  assert.string(dateTimeFormat, 'dateTimeFormat');
  // format logPath
  if (logpath.indexOf(".log") > -1) {
    logpath = logpath.replace(/\.log$/gi, "-%DATE%.log")
  } else {
    logpath = "#{logpath}-%DATE%.log"
  }

  // prepare a rotating write stream
  var stream = FileStreamRotator.getStream({
    filename: logpath,
    frequency: 'daily',
    verbose: false,
    date_format: "YYYYMMDD"
  });

  if (!logFormat) {
    logFormat = [
      ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version"'
      ':status :res[content-length] ":referrer" ":user-agent"'
      ':response-time'
    ].join(' ');
  }

  morgan.token('remote-addr', function(req, res) {
    return [req._clientIp, req._realIp, req._remoteIp].join(' - ');
  });
  morgan.token('remote-user', function(req, res) {
    return req.user && req.user.id && '-';
  });
  morgan.token('date', function() {
    return moment().format(dateTimeFormat);
  });
  morgan.token('req-body', function(req, res) {
    return JSON.stringify req.body;
  });

  return morgan(logFormat, { stream });
};



