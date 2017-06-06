const morgan = require('morgan');
const moment = require('moment');
const assert = require('assert-plus');
const FileStreamRotator = require('file-stream-rotator');

const defaultFormat = [
  ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version"',
  ':status :res[content-length] ":referrer" ":user-agent"',
  ':response-time',
].join(' ');

module.exports = (_logpath, dateTimeFormat, _logFormat, immediate = false) => {
  assert.string(_logpath, 'logpath');
  assert.string(dateTimeFormat, 'dateTimeFormat');

  let logpath;
  const logFormat = _logFormat || defaultFormat;

  // format logPath
  if (_logpath.substr(-4) === '.log') {
    logpath = `${_logpath.substring(0, _logpath.length - 4)}-%DATE%.log`;
  } else {
    logpath = `${_logpath}-%DATE%.log`;
  }

  // prepare a rotating write stream
  const stream = FileStreamRotator.getStream({
    filename: logpath,
    frequency: 'daily',
    verbose: false,
    date_format: 'YYYYMMDD',
  });

  morgan.token('remote-addr', (req) => [req._clientIp, req._realIp, req._remoteIp].join(' - '));
  morgan.token('remote-user', (req) => req.user && req.user.id && '-');
  morgan.token('date', () => moment().format(dateTimeFormat));
  morgan.token('req-body', (req) => JSON.stringify(req.body));

  return morgan(logFormat, { stream, immediate });
};
