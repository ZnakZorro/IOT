const http = require('http');
const fileSystem = require('fs');
const path = require('path');

http.createServer(function(request, response) {
  const filePath = path.join(__dirname, 'audio.mp3');
  const stat = fileSystem.statSync(filePath);

  response.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': stat.size
  });

  const readStream = fileSystem.createReadStream(filePath);
  readStream.pipe(response);
})
.listen(3003);
