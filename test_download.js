const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  }
};

const targetPath = path.join(__dirname, 'images', 'citi_test.svg');

https.get('https://upload.wikimedia.org/wikipedia/commons/1/15/Citi.svg', options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode} ${res.statusMessage}`);
    return;
  }
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, data);
    console.log('Downloaded successfully, size:', data.length);
  });
}).on('error', (err) => {
  console.error('Error:', err);
});
