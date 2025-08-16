# Portfolio System Setup

This portfolio system includes a hidden admin interface for uploading and managing media files.

## Features

- **Hidden Admin Route**: `/admin` - Accessible only with username/password
- **File Upload**: Drag & drop interface for images and videos
- **Portfolio Display**: Clean grid layout without captions or action buttons
- **File Management**: Delete uploaded files from the admin interface

## Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with:

```bash
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
```

**Default credentials** (change these in production):
- Username: `admin`
- Password: `password123`

### 2. File Structure

The system will automatically create:
- `public/uploads/` - Directory for uploaded files
- `src/data/portfolio.json` - Portfolio data storage

### 3. Access Admin Interface

Navigate to `/admin` in your browser and enter your credentials.

## Usage

### Admin Interface (`/admin`)

1. **Login**: Enter username and password
2. **Upload Files**: Drag & drop or browse for images/videos
3. **Manage Files**: View, delete uploaded items
4. **Supported Formats**: JPG, PNG, GIF, MP4, WebM

### Portfolio Display (`/portfolio`)

- Clean grid layout
- No captions or text
- Hover effects on images
- Auto-play videos on hover
- Responsive design

## Security Notes

- In production, implement proper JWT authentication
- Use strong, unique passwords
- Consider rate limiting for uploads
- Validate file types and sizes server-side

## API Endpoints

- `POST /api/admin/login` - Admin authentication
- `GET /api/portfolio` - Get portfolio items
- `POST /api/portfolio/upload` - Upload new files
- `DELETE /api/portfolio/[id]` - Delete portfolio item

## File Storage

Files are stored in `public/uploads/` and referenced in `src/data/portfolio.json`. The system automatically manages file paths and cleanup. 