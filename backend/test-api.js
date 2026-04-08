const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/products',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const products = JSON.parse(data);
    console.log('\n✅ API RESPONSE SUCCESS!\n');
    console.log(`Total Products Loaded: ${products.length}\n`);
    console.log('First Product Sample:');
    console.log(JSON.stringify(products[0], null, 2));
  });
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);
});

req.end();
