const fs = require('fs');
const http = require('http');
const moment = require('moment');
const assert = require('assert');
const middle = require('../');

describe('open-rest-access-log', function testUnit() {
  this.timeout(50 * 1000);
  describe('noraml', () => {
    it('case1', (done) => {
      const date = moment().format('YYYYMMDD');
      const logFile = `${__dirname}/access-${date}.log`;
      if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

      const ware = middle(`${__dirname}/access`, 'YYYY-MM-DD HH:mm:ss', null, true);
      assert.ok(ware instanceof Function);
      const req = {
        _clientIp: '192.168.4.114',
        _realIp: '192.168.4.191',
        _remoteIp: '127.0.0.1',
        user: {
          id: 1,
        },
        headers: {
          referrer: 'https://xiongfei.me/',
        },
        body: {
          hello: 'world',
        },
      };
      const res = {
        finished: false,
        end() {
          this.finished = true;
        },
      };

      ware(req, res, (error) => {
        res.end();
        setTimeout(() => {
          assert.ok(res.finished);
          assert.equal(null, error);
          const lines = fs.readFileSync(logFile).toString().trim().split('\n');
          assert.equal(1, lines.length);
          assert.ok(lines[0], '日志不为空');
          assert.ok(lines[0].length > 30, '日志的长度肯定大于30');
          assert.ok(lines[0].indexOf('192.168.4.114') > -1, '包含 _clientIp');
          assert.ok(lines[0].indexOf('192.168.4.191') > -1, '包含 _realIp');
          assert.ok(lines[0].indexOf('127.0.0.1') > -1, '包含 _remoteIp');

          if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
          done();
        }, 2000);
      });
    });

    it('case2', (done) => {
      const date = moment().format('YYYYMMDD');
      const logFile = `${__dirname}/access-${date}.log`;
      if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

      const logFormat = [
        ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version"',
        ':status :res[content-length] ":referrer" ":user-agent"',
        ':req-body',
      ].join(' ');
      const ware = middle(`${__dirname}/access.log`, 'YYYY-MM-DD HH:mm:ss', logFormat, true);
      assert.ok(ware instanceof Function);
      const req = {
        _clientIp: '192.168.4.114',
        _realIp: '192.168.4.191',
        _remoteIp: '127.0.0.1',
        user: {
          id: 1,
        },
        headers: {
          referrer: 'https://xiongfei.me/',
        },
        body: {
          hello: 'world',
        },
      };
      const res = {
        finished: false,
        end() {
          this.finished = true;
        },
        on() {
        },
      };

      ware(req, res, (error) => {
        res.end();
        setTimeout(() => {
          assert.ok(res.finished);
          assert.equal(null, error);
          const lines = fs.readFileSync(logFile).toString().trim().split('\n');
          assert.equal(1, lines.length);
          assert.ok(lines[0], '日志不为空');
          assert.ok(lines[0].length > 30, '日志的长度肯定大于30');
          assert.ok(lines[0].indexOf('world') > -1, '包含 body 的内容');
          assert.ok(lines[0].indexOf('192.168.4.114') > -1, '包含 _clientIp');
          assert.ok(lines[0].indexOf('192.168.4.191') > -1, '包含 _realIp');
          assert.ok(lines[0].indexOf('127.0.0.1') > -1, '包含 _remoteIp');

          if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
          done();
        }, 2000);
      });
    });

    it('case3', (done) => {
      const date = moment().format('YYYYMMDD');
      const logFile = `${__dirname}/access-${date}.log`;
      if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

      const ware = middle(`${__dirname}/access.log`, 'YYYY-MM-DD HH:mm:ss');
      assert.ok(ware instanceof Function);
      const req = {
        _clientIp: '192.168.4.114',
        _realIp: '192.168.4.191',
        _remoteIp: '127.0.0.1',
        user: {
          id: 1,
        },
        headers: {
          referrer: 'https://xiongfei.me/',
        },
        body: {
          hello: 'world',
        },
      };
      const res = {
        finished: false,
        end() {
          this.finished = true;
        },
        on() {
        },
      };

      ware(req, res, (error) => {
        res.end();
        setTimeout(() => {
          assert.ok(res.finished);
          assert.equal(null, error);
          const lines = fs.readFileSync(logFile).toString().trim().split('\n');
          assert.equal(1, lines.length);
          assert.equal(0, lines[0].length, '日志为空, 因为没有触发 res finish');

          if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
          done();
        }, 2000);
      });
    });
  });
});
