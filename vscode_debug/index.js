const http = require('http');

http.createServer((req, res) => {
  res.write('success123');
  res.end();
}).listen(8899);