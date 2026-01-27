
# Logo Upload সমস্যা সমাধান পরিকল্পনা

## সমস্যা চিহ্নিতকরণ

Logo দেখাচ্ছে না কারণ:

1. **Database-এ `logo` entry নেই** - `site_settings` টেবিলে অন্যান্য settings (site_name, site_tagline, contact_address ইত্যাদি) আছে, কিন্তু `logo` নামে কোনো row নেই
2. **Settings Admin শুধু update করে** - বর্তমান কোড existing entries update করতে পারে, কিন্তু নতুন entry তৈরি করতে পারে না
3. **Image upload নেই** - শুধু URL input আছে, proper file upload functionality নেই

## সমাধান পদক্ষেপ

### ধাপ ১: Database Migration
`site_settings` টেবিলে `logo` entry তৈরি করা:

```text
┌─────────────────────────────────────────────────┐
│  site_settings টেবিলে নতুন row                  │
├─────────────────────────────────────────────────┤
│  key: 'logo'                                    │
│  value_en: null                                 │
│  value_bn: null                                 │
│  value_zh: null                                 │
│  image_url: null (এখানে logo URL save হবে)    │
└─────────────────────────────────────────────────┘
```

### ধাপ ২: Settings Admin Page উন্নতি

**নতুন Features:**
- Supabase Storage ব্যবহার করে proper image upload
- Logo upload button এবং preview
- Hero background image upload সুবিধা
- Missing settings entries auto-create functionality

**UI পরিবর্তন:**
```text
┌─────────────────────────────────────────────────┐
│  Logo Section                                   │
├─────────────────────────────────────────────────┤
│  ┌─────────┐                                    │
│  │  Logo   │  [Upload Logo] [Remove]            │
│  │ Preview │                                    │
│  └─────────┘                                    │
│                                                 │
│  অথবা URL দিন: [________________________]      │
└─────────────────────────────────────────────────┘
```

### ধাপ ৩: Header/Footer Component Fix

Logo URL সঠিকভাবে fetch করা নিশ্চিত করা:
- `siteSettings?.logo?.image_url` চেক করা
- Fallback default logo দেখানো যদি URL না থাকে

## Technical Details

### Database Migration SQL
```sql
-- Logo entry তৈরি যদি না থাকে
INSERT INTO site_settings (key, value_en, value_bn, value_zh, image_url)
VALUES ('logo', null, null, null, null)
ON CONFLICT (key) DO NOTHING;
```

### Image Upload Flow
1. User selects image file
2. Upload to Supabase Storage (`uploads` bucket)
3. Get public URL
4. Save URL to `site_settings.image_url` where key = 'logo'
5. Refresh query cache
6. Header/Footer shows new logo

### Files to Modify

| File | পরিবর্তন |
|------|---------|
| Database Migration | `logo` row insert |
| `src/pages/admin/SettingsAdmin.tsx` | Image upload functionality যোগ |

## সময় অনুমান
- Database migration: ২ মিনিট
- Settings Admin update: ১০ মিনিট
- Testing: ৩ মিনিট

**মোট: ~১৫ মিনিট**
