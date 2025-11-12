# 🚀 Production Setup Guide

## 📋 Production Changes Needed

### 1. **Environment Variables**

Create a `.env.production` file:

```env
# Application URL (IMPORTANT for file URLs)
APP_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
JWT_SECRET=your-production-secret

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@email.com
MAIL_PASS=your-app-password

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Port
PORT=8000
```

### 2. **File Storage Options**

#### Option A: Cloud Storage (Recommended for Production)
Use **AWS S3**, **Cloudinary**, or **Google Cloud Storage** instead of local filesystem.

**Why?**
- Scalability
- CDN integration
- Better performance
- Auto backups

**Example with Cloudinary:**
```bash
npm install cloudinary multer-storage-cloudinary
```

```typescript
// src/config/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});
```

#### Option B: Keep Local Storage (Simple Deployment)
If deploying to a single server (not recommended for scale):

**Changes needed:**
```typescript
// src/main.ts - Already configured! ✅
app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
  prefix: '/uploads/',
});
```

**Ensure uploads folder persists:**
```bash
# Add to .gitignore (already done)
uploads/

# But keep the folder structure in production
mkdir -p uploads/publicPics
```

### 3. **Reverse Proxy (Nginx/Apache)**

If using Nginx, configure it to serve static files:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve uploaded files directly
    location /uploads/ {
        alias /path/to/your/app/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Proxy API requests to NestJS
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. **File Size & Security**

Current settings are already good, but review:

```typescript
// src/config/multer.config.ts
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB - adjust as needed

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
```

### 5. **Database Considerations**

The `profilePicture` field stores paths. For cloud storage, it will store URLs:

```prisma
model UserSetting {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  notifications  Boolean  @default(true)
  smsAlerts      Boolean  @default(false)
  profilePicture String?  // Can be path OR full URL depending on storage
}
```

### 6. **Build & Deployment**

```bash
# Build the application
npm run build

# Run in production
NODE_ENV=production npm run start:prod
```

---

## 📱 Frontend Integration

### **React Example**

#### 1. Upload Profile Image

```jsx
// components/ProfileImageUpload.jsx
import { useState } from 'react';

function ProfileImageUpload() {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    setPreview(URL.createObjectURL(file));

    // Create form data
    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('notifications', 'true');
    formData.append('smsAlerts', 'false');

    try {
      setUploading(true);
      const response = await fetch('http://localhost:8000/users/settings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Upload success:', data);
      
      // Use the returned profilePictureUrl
      setPreview(data.profilePictureUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleImageUpload}
      />
      
      {preview && (
        <img 
          src={preview} 
          alt="Profile" 
          style={{ width: 150, height: 150, borderRadius: '50%' }}
        />
      )}
      
      {uploading && <p>Uploading...</p>}
    </div>
  );
}

export default ProfileImageUpload;
```

#### 2. Display Profile Image

```jsx
// components/UserProfile.jsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile">
      <img 
        src={user.userSetting?.profilePictureUrl || '/default-avatar.png'} 
        alt={user.username}
        onError={(e) => {
          e.target.src = '/default-avatar.png'; // Fallback
        }}
        style={{ 
          width: 150, 
          height: 150, 
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />
      <h2>{user.username}</h2>
      <p>{user.email}</p>
    </div>
  );
}

export default UserProfile;
```

#### 3. Using with Axios

```jsx
import axios from 'axios';

// Upload
const uploadProfileImage = async (file, settings) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  formData.append('notifications', settings.notifications);
  formData.append('smsAlerts', settings.smsAlerts);

  const { data } = await axios.patch(
    'http://localhost:8000/users/settings',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return data.profilePictureUrl; // Returns full URL
};

// Fetch
const getUser = async (userId) => {
  const { data } = await axios.get(
    `http://localhost:8000/users/${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return data; // Contains userSetting.profilePictureUrl
};
```

---

## ✅ Checklist Before Production

- [ ] Set `APP_URL` environment variable to production domain
- [ ] Configure proper CORS origins (remove `'null'` from allowed origins)
- [ ] Choose storage strategy (Cloud vs Local)
- [ ] Set up reverse proxy (Nginx/Apache)
- [ ] Configure SSL/HTTPS
- [ ] Set up file size limits
- [ ] Add rate limiting for upload endpoint
- [ ] Set up monitoring and logging
- [ ] Configure CDN for static files (if using cloud storage)
- [ ] Test file uploads in production environment
- [ ] Set up automated backups (if using local storage)

---

## 🔒 Security Notes

1. **Validate file types on both client and server**
2. **Limit file size** (already implemented: 5MB)
3. **Sanitize file names** (already implemented: timestamp + random)
4. **Use authenticated routes** (already implemented: `@GetUserId()`)
5. **Rate limit upload endpoint** (consider adding)
6. **Scan uploaded files for malware** (consider adding in production)

---

## 📊 Current API Response

**GET /users/:id**
```json
{
  "id": "user123",
  "username": "john_doe",
  "email": "john@example.com",
  "userSetting": {
    "notifications": true,
    "smsAlerts": false,
    "profilePicture": "uploads/publicPics/1761750058823-544131670.png",
    "profilePictureUrl": "http://localhost:8000/uploads/publicPics/1761750058823-544131670.png"
  },
  "post": []
}
```

**PATCH /users/settings**
```json
{
  "id": "setting123",
  "userId": "user123",
  "notifications": true,
  "smsAlerts": false,
  "profilePicture": "uploads/publicPics/1761750058823-544131670.png",
  "profilePictureUrl": "http://localhost:8000/uploads/publicPics/1761750058823-544131670.png"
}
```

The `profilePictureUrl` is now automatically generated! 🎉


