# Supabase Admin Interface

A modern, beautiful admin interface for managing Supabase storage buckets and images.

## Features

- 🗄️ **Bucket Management** - Select and browse different storage buckets
- 📤 **Image Upload** - Drag-and-drop or click to upload multiple images
- 🖼️ **Image Grid** - View all images in a responsive grid layout
- 🗑️ **Delete Images** - Remove images with a single click
- 🔍 **Full-Size Preview** - Click any image to view it full-size
- 📁 **Folder Support** - Organize images in folders/paths

## Setup Instructions

### 1. Create Environment File

Create a file named `.env.local` in the root directory (`c:\Users\adedou\adminSupabase\.env.local`) with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dbqrenlvinqheyjppxby.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicXJlbmx2aW5xaGV5anBweGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk2MjQzNiwiZXhwIjoyMDcxNTM4NDM2fQ.GFmOEKusYDUpnqroLC3l2uNDmr0An5w6miEMZDCDmpY
```

### 2. Restart Development Server

After creating the `.env.local` file, restart the development server:

```bash
# Stop the current server (Ctrl+C)
# Then run:
npm run dev
```

### 3. Open the Application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Select a Bucket** - Choose a storage bucket from the dropdown
2. **Set Folder Path** (Optional) - Enter a folder path like `word-images/guess50` or leave empty for root
3. **Upload Images** - Drag and drop images or click to browse
4. **View Images** - Browse your images in the grid
5. **Delete Images** - Hover over an image and click the trash icon
6. **View Full Size** - Click any image to see it full-size

## Tech Stack

- **Next.js 15** - React framework
- **Supabase** - Backend and storage
- **TypeScript** - Type safety
- **Framer Motion** - Animations

## Project Structure

```
adminSupabase/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main admin page
├── components/
│   ├── BucketSelector.tsx  # Bucket dropdown
│   ├── ImageGrid.tsx       # Image display grid
│   └── UploadZone.tsx      # File upload component
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── storageUtils.ts     # Storage helper functions
└── .env.local            # Environment variables (you need to create this)
```
