const axios = require('axios');

const SANITY_PROJECT_ID = 'x1g6b84l';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = 'skt9KoERvrM5388fwQ7ucziVXjpOUwvsCRIUr8l22CuAbuUqdJQT5w7ixFQSuoKiDCNbjX2oIfrBaQfY5yvkgYD8oyEgeGczIkWralpK0QW3muNEcjwMXoKfbMZZBgSvtn0prKVTBBCVJlfDvlokCnkejpXmChztdRIwa8w6xyuuz7O7vm7a';

async function test() {
  console.log('Downloading test image...');
  const imgResp = await axios.get(
    'https://cdn.myportfolio.com/cde8bbaa-b571-4fd4-b038-3f4e498a7647/a5a1f8ed-7e18-4b5b-b957-39e7a7db4028_rw_600.jpg?h=7d07e38af6c7bfb3cfb0e4f8db01ed0e',
    { responseType: 'arraybuffer', timeout: 30000 }
  );
  const buffer = Buffer.from(imgResp.data);
  console.log('Downloaded:', buffer.length, 'bytes');
  console.log('First 4 bytes (JPEG magic):', buffer.slice(0, 4).toString('hex'));

  const url = 'https://' + SANITY_PROJECT_ID + '.api.sanity.io/v2024-01-01/assets/images/' + SANITY_DATASET + '?filename=test.jpg';
  console.log('\nUploading to:', url);

  try {
    const resp = await axios.post(url, buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Authorization': 'Bearer ' + SANITY_TOKEN
      },
      maxBodyLength: Infinity,
      timeout: 60000
    });
    console.log('\nSUCCESS!', JSON.stringify(resp.data, null, 2));
  } catch (err) {
    console.log('\nFAILED!');
    console.log('Status:', err.response ? err.response.status : 'no response');
    console.log('Response body:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
}

test();
