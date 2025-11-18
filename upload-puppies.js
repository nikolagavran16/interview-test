const fs = require('fs');
const https = require('https');
const FormData = require('form-data');

const token = 'YZlaiEASQmcqeE31jeOdNwtt-112339250310788-_R1ucy2NyfT_s2bPLDCc';
const spaceId = '288497814063714';

function getUploadCredentials(filename) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'mapi.storyblok.com',
            path: `/v1/spaces/${spaceId}/assets`,
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const response = JSON.parse(data);
                resolve(response);
            });
        });

        req.on('error', reject);
        req.write(JSON.stringify({ filename: filename }));
        req.end();
    });
}

function uploadToS3(credentials, filePath) {
    return new Promise((resolve, reject) => {
        const form = new FormData();

        Object.keys(credentials.fields).forEach(key => {
            form.append(key, credentials.fields[key]);
        });

        form.append('file', fs.createReadStream(filePath));

        const url = new URL(credentials.post_url);

        form.getLength((err, length) => {
            if (err) {
                reject(err);
                return;
            }

            const options = {
                hostname: url.hostname,
                path: url.pathname,
                method: 'POST',
                headers: {
                    ...form.getHeaders(),
                    'Content-Length': length
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    console.log('Status Code:', res.statusCode);
                    if (res.statusCode === 204 || res.statusCode === 201) {
                        resolve({ success: true, url: credentials.pretty_url });
                    } else {
                        console.log('Response:', data);
                        resolve({ success: false, data });
                    }
                });
            });

            req.on('error', reject);
            form.pipe(req);
        });
    });
}

async function uploadPuppyImage(filename) {
    try {
        console.log(`Getting upload credentials for ${filename}...`);
        const credentials = await getUploadCredentials(filename);

        console.log(`Uploading ${filename} to S3`);
        const result = await uploadToS3(credentials, `puppy-images/${filename}`);

        if (result.success) {
            console.log(`${filename} uploaded successfully URL: ${result.url}`);
        } else {
            console.log(`${filename} upload failed`);
        }
    } catch (error) {
        console.error(`Error uploading ${filename}:`, error);
    }
}

//upload all puppies
async function uploadAllPuppies() {
    const files = fs.readdirSync('puppy-images');

    for (const filename of files) {
        await uploadPuppyImage(filename);
    }

    console.log('all uploads completed');
}

//run the upload
uploadAllPuppies();