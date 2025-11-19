const fs = require('fs');
const https = require('https');
const FormData = require('form-data');

const token = 'YZlaiEASQmcqeE31jeOdNwtt-112339250310788-_R1ucy2NyfT_s2bPLDCc';
const spaceId = '288497814063714';
const storyId = '113457355894737';
const fileName = 'not-a-puppy.jpg';
const component = 'interview-story';

const req = (path, method = 'GET', body = null, bearer = false) =>
    new Promise((resolve, reject) => {
        const r = https.request(
            { hostname: 'mapi.storyblok.com', path, method, headers: { Authorization: bearer ? `Bearer ${token}` : token, ...(body ? { 'Content-Type': 'application/json' } : {}) } },
            s => { let d = ''; s.on('data', c => d += c); s.on('end', () => { try { resolve(JSON.parse(d)) } catch (e) { reject(e) } }) }
        );
        r.on('error', reject);
        if (body) r.write(JSON.stringify(body));
        r.end();
    });

(async () => {
    try {
        const cred = await req(`/v1/spaces/${spaceId}/assets`, 'POST', { filename: fileName, validate: 1 });
        const form = new FormData();
        Object.entries(cred.fields).forEach(([k, v]) => form.append(k, v));
        form.append('file', fs.createReadStream(fileName));

        await new Promise((res, rej) => {
            const url = new URL(cred.post_url);
            form.getLength((err, length) => {
                if (err) return rej(err);
                const r = https.request({ hostname: url.hostname, path: url.pathname, method: 'POST', headers: { ...form.getHeaders(), 'Content-Length': length } }, s => s.on('end', res));
                r.on('error', rej); form.pipe(r);
            });
        });

        await req(`/v1/spaces/${spaceId}/stories/${storyId}`, 'PUT', { story: { content: { component, image: cred.public_url } } }, true);
        console.log('Story updated with image:', cred.public_url);
    } catch (e) { console.error(e); }
})();