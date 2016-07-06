# open-rest-middle-ware-access-log
==================================

<pre>Write access log for http-server</pre>

<pre>npm install open-rest-access-log --save</pre>

<pre>
var logger = require('open-rest-access-log');
// /var/log/app/access-20160630.log
// /var/log/app/access-20160701.log
// /var/log/app/access-20160702.log
logger('/var/log/app/access', 'YYYY-MM-DD HH:mm:ss', logFormat);
</pre>
