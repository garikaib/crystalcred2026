const testUrl = 'http://localhost:3000/uploads/1768739963625-whatsapp-image-2022-03-10-at-7.22.59-pm.webp';

console.log(`Fetching: ${testUrl}`);

fetch(testUrl, {
    headers: {
        'User-Agent': 'Next.js Image Optimizer'
    }
})
    .then(async res => {
        console.log(`Status: ${res.status} ${res.statusText}`);
        console.log('Headers:', JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2));
        if (res.ok) {
            const buffer = await res.arrayBuffer();
            console.log(`Success! Data size: ${buffer.byteLength} bytes`);
        } else {
            const text = await res.text();
            console.log('Body snippet:', text.substring(0, 500));
        }
    })
    .catch(err => {
        console.error('Fetch error:', err);
    });
