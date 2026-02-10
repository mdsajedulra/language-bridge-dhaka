
# Our Teachers Feature

## সারসংক্ষেপ
একটি সম্পূর্ণ "Our Teachers" feature তৈরি হবে যেখানে থাকবে:
1. Database-এ নতুন `teachers` table
2. একটি আলাদা Teachers page (`/teachers`)
3. About page-এ "Our Teachers" section
4. Admin panel-এ Teachers management page

---

## ধাপ ১: Database - `teachers` Table তৈরি

| Column | Type | Required | Default |
|--------|------|----------|---------|
| id | uuid | Yes | auto |
| name | text | Yes | - |
| phone | text | No | - |
| email | text | No | - |
| photo_url | text | No | - |
| designation_en | text | No | - |
| designation_bn | text | No | - |
| designation_zh | text | No | - |
| bio_en | text | No | - |
| bio_bn | text | No | - |
| bio_zh | text | No | - |
| specialization_en | text | No | - |
| specialization_bn | text | No | - |
| specialization_zh | text | No | - |
| is_featured | boolean | No | false |
| is_active | boolean | No | true |
| sort_order | integer | No | 0 |
| created_at | timestamptz | Yes | now() |

RLS Policies:
- Anyone can view active teachers (SELECT where is_active = true)
- Admins can manage all (ALL with has_role check)

---

## ধাপ ২: Teachers Admin Page

নতুন ফাইল: `src/pages/admin/TeachersAdmin.tsx`

AlumniAdmin এর মতো same pattern follow করবে:
- Full CRUD (Create, Read, Update, Delete)
- Cloudinary image upload for teacher photo
- Multi-language fields (designation, bio, specialization)
- Featured ও Active toggle
- Sort order management

---

## ধাপ ৩: Teachers Public Page

নতুন ফাইল: `src/pages/Teachers.tsx`

Route: `/teachers`

Teachers দের profile cards দেখাবে:
- Photo, Name, Designation
- Specialization
- Short bio
- Featured teachers হাইলাইট হবে

---

## ধাপ ৪: About Page-এ "Our Teachers" Section

নতুন component: `src/components/about/TeachersSection.tsx`

About page-এ Stats section এর পরে একটি "Our Teachers" section যোগ হবে:
- Featured teachers দেখাবে (max 4-6)
- "View All Teachers" button থাকবে `/teachers` page-এ যাওয়ার জন্য

---

## ধাপ ৫: Routing ও Navigation Update

- `App.tsx`-এ `/teachers` route যোগ
- `App.tsx`-এ `/admin/teachers` route যোগ
- `AdminLayout.tsx`-এ Teachers menu item যোগ

---

## সম্পূর্ণ File List

| Action | File Path |
|--------|-----------|
| Migration | `teachers` table তৈরি + RLS |
| Create | `src/pages/admin/TeachersAdmin.tsx` |
| Create | `src/pages/Teachers.tsx` |
| Create | `src/components/about/TeachersSection.tsx` |
| Update | `src/pages/About.tsx` (TeachersSection যোগ) |
| Update | `src/App.tsx` (routes যোগ) |
| Update | `src/components/admin/AdminLayout.tsx` (menu item যোগ) |

---

## Technical Details

### TeachersSection Component (About Page)

```text
┌──────────────────────────────────────────────┐
│           Our Teachers                        │
│    Meet our expert language instructors       │
│                                               │
│  ┌────────┐  ┌────────┐  ┌────────┐          │
│  │ Photo  │  │ Photo  │  │ Photo  │          │
│  │ Name   │  │ Name   │  │ Name   │          │
│  │ Desig. │  │ Desig. │  │ Desig. │          │
│  │ Bio    │  │ Bio    │  │ Bio    │          │
│  └────────┘  └────────┘  └────────┘          │
│                                               │
│         [View All Teachers →]                 │
└──────────────────────────────────────────────┘
```

### Teachers Page Layout

```text
Hero Banner
    │
    ▼
Grid of Teacher Cards (3 columns on desktop)
    - Photo (Cloudinary)
    - Name
    - Designation (localized)
    - Specialization (localized)
    - Bio excerpt (localized)
```

### Data Query Pattern
Same pattern as Alumni:
- Public pages: `is_active = true`, ordered by `sort_order`
- Admin: full access, all records
- Featured filter for About page section: `is_featured = true`
