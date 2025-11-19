const https = require('https');
const token = 'YZlaiEASQmcqeE31jeOdNwtt-112339250310788-_R1ucy2NyfT_s2bPLDCc';

https.get('https://mapi.storyblok.com/v1/spaces', {
    headers: { Authorization: `Bearer ${token}` }
}, res => console.log('Status:', res.statusCode));