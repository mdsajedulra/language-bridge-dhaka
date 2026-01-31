

# Cloudinary Image Upload Integration পরিকল্পনা

## সারসংক্ষেপ
সব Admin pages-এ Cloudinary ব্যবহার করে image/media upload functionality যোগ করা হবে। এটি আগের Supabase Storage এর বদলে Cloudinary CDN ব্যবহার করবে।

## Cloudinary সুবিধা
- দ্রুত image loading (global CDN)
- Automatic image optimization
- On-the-fly image transformation (resize, crop, format)
- Better performance for media-heavy websites

---

## যেসব Admin Pages-এ Image Upload যোগ হবে

| Page | Image Field | বর্তমান অবস্থা |
|------|-------------|----------------|
| Settings Admin | Logo | URL input + Supabase upload |
| Hero Admin | Background Image | শুধু URL input |
| Courses Admin | Course Image | শুধু URL input |
| Gallery Admin | Gallery Images | শুধু URL input |
| Books Admin | Cover Image | শুধু URL input |
| Media Admin | Media Image | শুধু URL input |
| Partners Admin | Logo | শুধু URL input |
| Alumni Admin | Photo | শুধু URL input |
| Testimonials Admin | Avatar | শুধু URL input |
| Videos Admin | Thumbnail | শুধু URL input |

---

## Implementation পদক্ষেপ

### ধাপ ১: Cloudinary Configuration
Environment variable হিসেবে Cloud Name সংরক্ষণ করা

```text
VITE_CLOUDINARY_CLOUD_NAME = "dw9jqevhl"
VITE_CLOUDINARY_UPLOAD_PRESET = "unsigned_preset" (তৈরি করতে হবে)
```

**আপনার কাজ:** Cloudinary Dashboard-এ একটি **Unsigned Upload Preset** তৈরি করতে হবে:
1. Cloudinary Dashboard > Settings > Upload
2. "Add upload preset" ক্লিক করুন
3. Signing Mode: **Unsigned** সিলেক্ট করুন
4. একটি নাম দিন (যেমন: `language_bridge_upload`)
5. Save করুন

### ধাপ ২: Cloudinary Upload Utility তৈরি

নতুন ফাইল: `src/lib/cloudinary.ts`

```text
Upload Flow:
┌─────────────────┐
│  User selects   │
│     file        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validate file  │
│  (type, size)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Upload to     │
│   Cloudinary    │
│  (unsigned API) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Get secure_url │
│  from response  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Save URL to    │
│   Database      │
└─────────────────┘
```

### ধাপ ৩: Reusable CloudinaryUpload Component তৈরি

নতুন ফাইল: `src/components/ui/cloudinary-upload.tsx`

**Features:**
- File select button
- Drag and drop support
- Upload progress indicator
- Image preview
- Remove image option
- File type validation (images, videos)
- Size limit validation

```text
┌────────────────────────────────────────────────────┐
│  Cloudinary Upload Component                        │
├────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐     ┌──────────────────┐     │
│  │                  │     │  [Upload Image]  │     │
│  │   Image Preview  │     │                  │     │
│  │   (if uploaded)  │     │  [Remove]        │     │
│  │                  │     │                  │     │
│  └──────────────────┘     └──────────────────┘     │
│                                                     │
│  Supported: JPG, PNG, GIF, WebP (max 10MB)         │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │  Or enter URL manually: [________________] │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
└────────────────────────────────────────────────────┘
```

### ধাপ ৪: সব Admin Pages Update করা

প্রতিটি admin page-এ:
1. URL input field এর পাশে Upload button যোগ
2. CloudinaryUpload component integrate
3. Upload success এ form state update

---

## সম্পূর্ণ File List

| Action | File Path |
|--------|-----------|
| Create | `src/lib/cloudinary.ts` |
| Create | `src/components/ui/cloudinary-upload.tsx` |
| Update | `src/pages/admin/SettingsAdmin.tsx` |
| Update | `src/pages/admin/HeroAdmin.tsx` |
| Update | `src/pages/admin/CoursesAdmin.tsx` |
| Update | `src/pages/admin/GalleryAdmin.tsx` |
| Update | `src/pages/admin/BooksAdmin.tsx` |
| Update | `src/pages/admin/MediaAdmin.tsx` |
| Update | `src/pages/admin/PartnersAdmin.tsx` |
| Update | `src/pages/admin/AlumniAdmin.tsx` |
| Update | `src/pages/admin/TestimonialsAdmin.tsx` |
| Update | `src/pages/admin/VideosAdmin.tsx` |

---

## Technical Details

### Cloudinary Unsigned Upload API

```text
POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload

FormData:
- file: [image file or base64]
- upload_preset: "your_unsigned_preset"
- folder: "language-bridge" (optional)

Response:
{
  "secure_url": "https://res.cloudinary.com/...",
  "public_id": "language-bridge/image_abc123",
  "width": 800,
  "height": 600,
  ...
}
```

### Upload Utility Function Structure

```text
uploadToCloudinary(file, options):
  ├── Validate file type
  ├── Validate file size (max 10MB)
  ├── Create FormData
  ├── POST to Cloudinary API
  ├── Handle progress (optional)
  └── Return secure_url or throw error
```

### Component Props Interface

```text
CloudinaryUploadProps:
  - value: string | null (current image URL)
  - onChange: (url: string | null) => void
  - folder?: string (Cloudinary folder)
  - accept?: string (file types: "image/*" | "video/*")
  - maxSize?: number (in MB, default 10)
  - className?: string
```

---

## আপনার জন্য Action Item

Cloudinary Dashboard-এ **Unsigned Upload Preset** তৈরি করতে হবে। করার পরে আমাকে preset এর নাম জানান, তারপর আমি implementation শুরু করব।

অথবা যদি preset তৈরি না থাকে, আমি একটি default name (`language_bridge_upload`) দিয়ে শুরু করতে পারি এবং আপনি পরে সেই নামে preset তৈরি করতে পারবেন।

---

## সময় অনুমান
- Cloudinary utility: ৫ মিনিট
- Upload component: ১০ মিনিট
- Admin pages update: ২৫ মিনিট (১০টি page)

**মোট: ~৪০ মিনিট**

