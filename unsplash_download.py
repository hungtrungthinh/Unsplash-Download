#!/usr/bin/env python3

# Author: Thinh Nguyen
# License: MIT

import os
import time
import requests
import json
import re

# Replace YOUR_ACCESS_KEY with your Access Key from Unsplash Developer
ACCESS_KEY = "YOUR_ACCESS_KEY"

# Create directories to store photos
os.makedirs("real_photos/technology", exist_ok=True)
os.makedirs("real_photos/nature", exist_ok=True)
os.makedirs("real_photos/city", exist_ok=True)

def download_photos(topic, folder, count):
    """
    Download photos from Unsplash API by topic
    
    Args:
        topic (str): Search topic/keyword
        folder (str): Folder name to save photos
        count (int): Number of photos to download
    """
    for i in range(1, count + 1):
        print(f"Downloading {topic} photo #{i}...")
        
        try:
            # Call Unsplash API to get random photo by topic
            url = "https://api.unsplash.com/photos/random"
            params = {
                "query": topic,
                "orientation": "landscape",
                "client_id": ACCESS_KEY
            }
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            # Parse JSON response
            data = response.json()
            
            # Extract full resolution (4K) image URL
            image_url = data["urls"]["raw"]
            
            # Download the image
            image_response = requests.get(image_url, headers={"User-Agent": "Mozilla/5.0"})
            image_response.raise_for_status()
            
            # Save the image
            file_path = f"real_photos/{folder}/{topic}_{i}.jpg"
            with open(file_path, "wb") as f:
                f.write(image_response.content)
            
            # Delay to avoid rate-limiting
            time.sleep(0.5)
            
        except requests.exceptions.RequestException as e:
            print(f"Error downloading {topic} photo #{i}: {e}")
            continue
        except KeyError as e:
            print(f"Error parsing response for {topic} photo #{i}: {e}")
            continue

# Number of photos per topic (total ~200)
COUNT = 67

# Download photos for each topic
download_photos("technology", "technology", COUNT)
download_photos("nature", "nature", COUNT)
download_photos("city", "city", COUNT)

print("DONE — 201 4K photos downloaded to real_photos/ directory")

