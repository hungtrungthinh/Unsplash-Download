# Unsplash Photo Downloader

Scripts to download high-resolution photos from Unsplash API organized by topics (technology, nature, city). Available in **Bash**, **Python**, and **Node.js**.

## Table of Contents

- [Available Scripts](#available-scripts)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [API Requirements](#api-requirements)
- [Demo API vs Production API](#demo-api-vs-production-api)
- [Usage](#usage)
  - [Bash Script](#bash-script)
  - [Python Script](#python-script)
  - [Node.js Script](#nodejs-script)
- [Configuration](#configuration)
- [Rate Limiting](#rate-limiting)

## Available Scripts

This repository contains three implementations with identical functionality:

- **`unsplash_download.sh`** - Bash shell script (requires curl)
- **`unsplash_download.py`** - Python script (requires requests library)
- **`unsplash_download.js`** - Node.js script (uses built-in modules)

Choose the one that best fits your environment and preferences.

## Prerequisites

### For Bash Script (`unsplash_download.sh`)
- **Bash shell** (macOS/Linux) or Git Bash (Windows)
- **curl** command-line tool (usually pre-installed)
- **Unsplash API Access Key** (see [API Requirements](#api-requirements))

### For Python Script (`unsplash_download.py`)
- **Python 3.6+** installed
- **requests** library: `pip install requests`
- **Unsplash API Access Key** (see [API Requirements](#api-requirements))

### For Node.js Script (`unsplash_download.js`)
- **Node.js 12+** installed
- **Unsplash API Access Key** (see [API Requirements](#api-requirements))
- No additional packages required (uses built-in modules)

## Getting Started

1. **Get your Unsplash API Access Key:**
   - Visit [Unsplash Developers](https://unsplash.com/developers)
   - Create an account or log in
   - Create a new application
   - Copy your Access Key

2. **Update your chosen script:**
   - Open the script file (`unsplash_download.sh`, `unsplash_download.py`, or `unsplash_download.js`)
   - Replace `YOUR_ACCESS_KEY` with your actual Access Key

3. **Install dependencies (if needed):**
   - **Python**: `pip install requests`
   - **Node.js**: No dependencies needed
   - **Bash**: No dependencies needed

4. **Run the script:**
   - See [Usage](#usage) section for specific instructions for each script

## How It Works

The script performs the following steps:

1. **Directory Creation**: Creates three folders (`technology`, `nature`, `city`) inside `real_photos/` directory

2. **Photo Download Process** (for each topic):
   - Makes an API call to Unsplash `/photos/random` endpoint
   - Searches for photos matching the topic query
   - Requests landscape orientation photos
   - Extracts the raw (full resolution) image URL from the JSON response
   - Downloads the image using curl
   - Saves it with a descriptive filename (e.g., `technology_1.jpg`)
   - Waits 0.5 seconds between downloads to respect rate limits

3. **Output**: Downloads 67 photos per topic (201 total) as 4K resolution images

### Technical Details

- **API Endpoint**: `https://api.unsplash.com/photos/random`
- **Query Parameters**:
  - `query`: Search term (technology, nature, city)
  - `orientation`: `landscape` (horizontal photos)
  - `client_id`: Your Unsplash Access Key
- **Image Format**: Downloads raw/full resolution URLs (up to 4K)
- **File Naming**: `{topic}_{number}.jpg` (e.g., `technology_1.jpg`)

## API Requirements

### What You Need

1. **Unsplash Account**: Free account on [unsplash.com](https://unsplash.com)

2. **Developer Application**:
   - Go to [Unsplash Developers](https://unsplash.com/developers)
   - Click "Your apps" → "New Application"
   - Accept the API Use and Access Agreement
   - Fill in application details:
     - **Application name**: Your app name
     - **Description**: Brief description of your use case
     - **Website URL**: Your website (if applicable)

3. **Access Key**:
   - After creating the application, you'll receive:
     - **Access Key**: Used for API authentication (public, can be exposed)
     - **Secret Key**: Keep this private (not needed for this script)

### API Rate Limits

- **Demo API**: 50 requests per hour
- **Production API**: 5,000 requests per hour (after approval)

## Demo API vs Production API

### Demo API (Default - Before Approval)

When you first create an Unsplash application, you receive **Demo API** access:

| Feature | Demo API |
|---------|----------|
| **Rate Limit** | 50 requests per hour |
| **Status** | Available immediately |
| **Approval Required** | No |
| **Use Case** | Testing and development |
| **Production Ready** | No (too restrictive) |

**Limitations:**
- Very low rate limit (50/hour)
- Not suitable for production use
- May not meet your application's needs

### Production API (After Approval)

To get **Production API** access, you need to request approval from Unsplash:

| Feature | Production API |
|---------|----------------|
| **Rate Limit** | 5,000 requests per hour |
| **Status** | Requires approval |
| **Approval Required** | Yes |
| **Use Case** | Production applications |
| **Production Ready** | Yes |

**How to Request Production Access:**

1. **Complete Your Application Profile:**
   - Ensure your application has:
     - Clear description of use case
     - Valid website URL
     - Proper attribution implementation (if applicable)

2. **Request Production Access:**
   - Go to your application dashboard
   - Look for "Request Production" or "Upgrade to Production" option
   - Fill out the request form explaining:
     - How you'll use the API
     - Expected traffic/usage
     - How you'll attribute photos (if required)
     - Your application's purpose

3. **Wait for Review:**
   - Unsplash team reviews requests (usually 1-3 business days)
   - You'll receive email notification of approval/rejection

4. **After Approval:**
   - Your Access Key automatically upgrades to Production
   - Rate limit increases to 5,000 requests/hour
   - No code changes needed - same Access Key works

**Important Notes:**
- The same Access Key is used for both Demo and Production
- No code changes required when upgraded
- Rate limit increase happens automatically after approval
- Always check your current rate limit status in the developer dashboard

### Rate Limit Comparison

For this script downloading 201 photos:
- **Demo API**: Would take ~4 hours (50 requests/hour limit)
- **Production API**: Completes in ~2 minutes (5,000 requests/hour limit)

## Usage

All scripts download the same content:
- 67 technology photos → `real_photos/technology/`
- 67 nature photos → `real_photos/nature/`
- 67 city photos → `real_photos/city/`

**Total**: 201 photos

### Bash Script

1. **Make the script executable:**
   ```bash
   chmod +x unsplash_download.sh
   ```

2. **Run the script:**
   ```bash
   ./unsplash_download.sh
   ```

   Or run directly with bash:
   ```bash
   bash unsplash_download.sh
   ```

### Python Script

1. **Install required library (if not already installed):**
   ```bash
   pip install requests
   ```

   Or using pip3:
   ```bash
   pip3 install requests
   ```

2. **Make the script executable (optional):**
   ```bash
   chmod +x unsplash_download.py
   ```

3. **Run the script:**
   ```bash
   python3 unsplash_download.py
   ```

   Or:
   ```bash
   python unsplash_download.py
   ```

   Or if executable:
   ```bash
   ./unsplash_download.py
   ```

**Python Script Features:**
- Better error handling with try-except blocks
- Cleaner JSON parsing using `requests` library
- More readable code structure
- Automatic directory creation with `os.makedirs`

### Node.js Script

1. **Make the script executable (optional):**
   ```bash
   chmod +x unsplash_download.js
   ```

2. **Run the script:**
   ```bash
   node unsplash_download.js
   ```

   Or if executable:
   ```bash
   ./unsplash_download.js
   ```

**Node.js Script Features:**
- Uses built-in Node.js modules (no npm install needed)
- Asynchronous/await pattern for better performance
- Promise-based error handling
- Stream-based file writing for efficient memory usage

### Customization

You can modify any script to customize behavior:

1. **Change number of photos per topic:**
   - **Bash**: Change `COUNT=67` on line 36
   - **Python**: Change `COUNT = 67` on line 50
   - **Node.js**: Change `const COUNT = 67` on line 120

2. **Add more topics:**
   
   **Bash:**
   ```bash
   # Add folder creation
   mkdir -p real_photos/{technology,nature,city,animals,food}
   
   # Add download calls
   download_photos "animals" "animals" $COUNT
   download_photos "food" "food" $COUNT
   ```
   
   **Python:**
   ```python
   # Add folder creation
   os.makedirs("real_photos/animals", exist_ok=True)
   os.makedirs("real_photos/food", exist_ok=True)
   
   # Add download calls
   download_photos("animals", "animals", COUNT)
   download_photos("food", "food", COUNT)
   ```
   
   **Node.js:**
   ```javascript
   // Add folder to dirs array
   const dirs = ['real_photos/technology', 'real_photos/nature', 'real_photos/city', 'real_photos/animals', 'real_photos/food'];
   
   // Add download calls
   await downloadPhotos("animals", "animals", COUNT);
   await downloadPhotos("food", "food", COUNT);
   ```

3. **Change photo orientation:**
   - **Bash**: Change `orientation=landscape` to `orientation=portrait` or `orientation=squarish` on line 19
   - **Python**: Change `"orientation": "landscape"` to `"orientation": "portrait"` on line 30
   - **Node.js**: Change `orientation=landscape` to `orientation=portrait` on line 50

4. **Change download delay:**
   - **Bash**: Change `sleep 0.5` to `sleep 1.0` on line 31
   - **Python**: Change `time.sleep(0.5)` to `time.sleep(1.0)` on line 45
   - **Node.js**: Change `500` (milliseconds) to `1000` on line 80

## Configuration

### Environment Variables (Optional)

You can use environment variables instead of hardcoding the Access Key:

```bash
#!/bin/bash
ACCESS_KEY="${UNSPLASH_ACCESS_KEY:-YOUR_DEFAULT_KEY}"
```

Then run:
```bash
export UNSPLASH_ACCESS_KEY="your_key_here"
./unsplash_download.sh
```

### Script Variables

**Bash (`unsplash_download.sh`):**
- `ACCESS_KEY`: Your Unsplash API Access Key (line 4)
- `COUNT`: Number of photos per topic (line 36, default: 67)
- `sleep`: Delay between downloads in seconds (line 31, default: 0.5)

**Python (`unsplash_download.py`):**
- `ACCESS_KEY`: Your Unsplash API Access Key (line 8)
- `COUNT`: Number of photos per topic (line 50, default: 67)
- `time.sleep()`: Delay between downloads in seconds (line 45, default: 0.5)

**Node.js (`unsplash_download.js`):**
- `ACCESS_KEY`: Your Unsplash API Access Key (line 8)
- `COUNT`: Number of photos per topic (line 120, default: 67)
- `setTimeout()`: Delay between downloads in milliseconds (line 80, default: 500ms = 0.5s)

## Rate Limiting

The script includes a 0.5-second delay between downloads to avoid hitting rate limits:

- **Demo API**: With 0.5s delay, you can download ~7,200 photos/hour (theoretical), but limited to 50 API calls/hour
- **Production API**: With 0.5s delay, you can download ~7,200 photos/hour (theoretical), limited to 5,000 API calls/hour

**Recommendations:**
- For Demo API: Increase delay to 72 seconds (50 requests/hour = 1 request per 72 seconds)
- For Production API: Current 0.5s delay is fine, or reduce to 0.36s for maximum throughput

## Troubleshooting

### Error: "Rate limit exceeded"
- **Solution**: Increase the `sleep` delay or wait until the rate limit resets

### Error: "Invalid access key"
- **Solution**: Verify your Access Key is correct and copied properly

### Error: "No photos found"
- **Solution**: Try different topic keywords or check your internet connection

### Images not downloading

**Bash:**
- Check if `curl` is installed: `which curl`
- Verify internet connectivity
- Check if the `real_photos` directory has write permissions

**Python:**
- Check if `requests` is installed: `pip list | grep requests`
- If not installed: `pip install requests`
- Verify internet connectivity
- Check if the `real_photos` directory has write permissions

**Node.js:**
- Check Node.js version: `node --version` (should be 12+)
- Verify internet connectivity
- Check if the `real_photos` directory has write permissions

### Python: ModuleNotFoundError: No module named 'requests'
- **Solution**: Install requests: `pip install requests` or `pip3 install requests`

### Node.js: Command not found
- **Solution**: Ensure Node.js is installed: `node --version`
- Install Node.js from [nodejs.org](https://nodejs.org/)

## License

This script uses Unsplash API. Please review [Unsplash API Terms](https://unsplash.com/api/terms) and ensure proper attribution if required for your use case.

## References

- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Unsplash Developers Portal](https://unsplash.com/developers)
- [Unsplash API Terms](https://unsplash.com/api/terms)

