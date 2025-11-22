#!/usr/bin/env node

// Author: Thinh Nguyen
// License: MIT

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Replace YOUR_ACCESS_KEY with your Access Key from Unsplash Developer
const ACCESS_KEY = "YOUR_ACCESS_KEY";

// Create directories to store photos
const dirs = ['real_photos/technology', 'real_photos/nature', 'real_photos/city'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

/**
 * Download photos from Unsplash API by topic
 * @param {string} topic - Search topic/keyword
 * @param {string} folder - Folder name to save photos
 * @param {number} count - Number of photos to download
 * @returns {Promise<void>}
 */
function downloadPhotos(topic, folder, count) {
    return new Promise((resolve) => {
        let downloaded = 0;
        
        const downloadNext = (index) => {
            if (index > count) {
                resolve();
                return;
            }
            
            console.log(`Downloading ${topic} photo #${index}...`);
            
            // Call Unsplash API to get random photo by topic
            const apiUrl = `https://api.unsplash.com/photos/random?query=${topic}&orientation=landscape&client_id=${ACCESS_KEY}`;
            
            https.get(apiUrl, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        // Parse JSON response
                        const jsonData = JSON.parse(data);
                        
                        // Extract full resolution (4K) image URL
                        const imageUrl = jsonData.urls.raw;
                        
                        // Download the image
                        const protocol = imageUrl.startsWith('https') ? https : http;
                        
                        protocol.get(imageUrl, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0'
                            }
                        }, (imageRes) => {
                            const filePath = `real_photos/${folder}/${topic}_${index}.jpg`;
                            const fileStream = fs.createWriteStream(filePath);
                            
                            imageRes.pipe(fileStream);
                            
                            fileStream.on('finish', () => {
                                fileStream.close();
                                downloaded++;
                                
                                // Delay to avoid rate-limiting
                                setTimeout(() => {
                                    downloadNext(index + 1);
                                }, 500);
                            });
                        }).on('error', (err) => {
                            console.error(`Error downloading ${topic} photo #${index}:`, err.message);
                            setTimeout(() => {
                                downloadNext(index + 1);
                            }, 500);
                        });
                        
                    } catch (err) {
                        console.error(`Error parsing response for ${topic} photo #${index}:`, err.message);
                        setTimeout(() => {
                            downloadNext(index + 1);
                        }, 500);
                    }
                });
                
            }).on('error', (err) => {
                console.error(`Error fetching API for ${topic} photo #${index}:`, err.message);
                setTimeout(() => {
                    downloadNext(index + 1);
                }, 500);
            });
        };
        
        downloadNext(1);
    });
}

// Number of photos per topic (total ~200)
const COUNT = 67;

// Download photos for each topic sequentially
(async () => {
    await downloadPhotos("technology", "technology", COUNT);
    await downloadPhotos("nature", "nature", COUNT);
    await downloadPhotos("city", "city", COUNT);
    
    console.log("DONE — 201 4K photos downloaded to real_photos/ directory");
})();

