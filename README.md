# open-rest-middle-ware-access-log
==================================

[![Build status](https://api.travis-ci.org/open-node/open-rest-access-log.svg?branch=master)](https://travis-ci.org/open-node/open-rest-access-log)
[![codecov](https://codecov.io/gh/open-node/open-rest-access-log/branch/master/graph/badge.svg)](https://codecov.io/gh/open-node/open-rest-access-log)

## Node version
<pre> >= 6 </pre>

# Usage

<pre>Write access log for http-server</pre>

<pre>npm install open-rest-access-log --save</pre>

<pre>
const logger = require('open-rest-access-log');
// /var/log/app/access-20160630.log
// /var/log/app/access-20160701.log
// /var/log/app/access-20160702.log
logger('/var/log/app/access', 'YYYY-MM-DD HH:mm:ss', logFormat);
</pre>
