# Unsplash Photo Downloader - Web App

A Next.js 16 web application for downloading high-resolution photos from Unsplash API and packaging them as ZIP files.

## Features

- 🔑 **Access Key Configuration**: Enter your Unsplash API Access Key
- 🎯 **Mode Selection**: Choose between Demo API (50 req/hour) or Production API (5,000 req/hour)
- 📦 **Multiple Topics**: Add multiple topics and customize photo counts
- 📥 **ZIP Download**: Automatically packages all photos into a ZIP file
- ⚡ **Real-time Progress**: See download progress in real-time
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode support

## Prerequisites

- **Node.js** 18+ installed
- **Unsplash API Access Key** from [Unsplash Developers](https://unsplash.com/developers)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Configure Access Key:**
   - Enter your Unsplash API Access Key
   - Select API mode (Demo or Production)
   - Click "Save Configuration"

2. **Set Up Topics:**
   - Add topics you want to download (e.g., technology, nature, city)
   - Set folder names for organization
   - Specify number of photos per topic

3. **Download:**
   - Click "Download Photos as ZIP"
   - Wait for the download to complete
   - Your ZIP file will automatically download

## API Modes

### Demo API
- **Rate Limit**: 50 requests per hour
- **Use Case**: Testing and development
- **Approval**: Not required

### Production API
- **Rate Limit**: 5,000 requests per hour
- **Use Case**: Production applications
- **Approval**: Requires approval from Unsplash

See the main [README.md](./README.md) for detailed information about getting API access and requesting production approval.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── download/
│   │       └── route.ts          # API route for downloading photos
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── components/
│   ├── Configuration.tsx         # Access key configuration component
│   └── Downloader.tsx            # Photo downloader component
├── package.json
├── tsconfig.json
└── next.config.js
```

## Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **JSZip**: ZIP file creation library

## Author

**Thinh Nguyen**

## License

**MIT License**

Copyright (c) 2025 Thinh Nguyen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

