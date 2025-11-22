#!/bin/bash

# Replace YOUR_ACCESS_KEY with your Access Key from Unsplash Developer
ACCESS_KEY="YOUR_ACCESS_KEY"

# Create directories to store photos
mkdir -p real_photos/{technology,nature,city}

# Function to download photos by topic
download_photos() {
  TOPIC=$1
  FOLDER=$2
  COUNT=$3

  for i in $(seq 1 $COUNT); do
    echo "Downloading $TOPIC photo #$i..."

    # Call Unsplash API to get random photo by topic
    RESPONSE=$(curl -s "https://api.unsplash.com/photos/random?query=$TOPIC&orientation=landscape&client_id=$ACCESS_KEY")

    # Extract full resolution (4K) image URL
    URL=$(echo $RESPONSE | grep -o '"urls":{"raw":"[^"]*' | sed 's/"urls":{"raw":"//')

    # Replace escape characters if present
    URL=${URL//\\u0026/&}

    # Download the image
    curl -s -L -A "Mozilla/5.0" "$URL" -o "real_photos/$FOLDER/${TOPIC}_$i.jpg"

    # Delay to avoid rate-limiting
    sleep 0.5
  done
}

# Number of photos per topic (total ~200)
COUNT=67

# Download photos for each topic
download_photos "technology" "technology" $COUNT
download_photos "nature" "nature" $COUNT
download_photos "city" "city" $COUNT

echo "DONE — 201 4K photos downloaded to real_photos/ directory"
