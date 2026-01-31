
# Alumni Phone Number ও Bulk Upload Feature

## সারসংক্ষেপ
Alumni টেবিলে phone number field যোগ করা হবে এবং Excel/CSV ফাইল থেকে bulk upload করার সুবিধা দেওয়া হবে।

---

## যা করা হবে

### ধাপ ১: Database Schema Update
Alumni টেবিলে নতুন `phone` column যোগ করা হবে।

```sql
ALTER TABLE alumni ADD COLUMN phone TEXT;
```

### ধাপ ২: CSV/Excel Parser Library Install
PapaParse library ব্যবহার করা হবে CSV parsing এর জন্য। এটি lightweight এবং Excel CSV format support করে।

```text
Package: papaparse (CSV parsing)
```

### ধাপ ৩: Bulk Upload Component তৈরি

নতুন features:
- CSV/Excel file upload button
- File drag and drop support  
- Data preview table (upload করার আগে দেখা যাবে)
- Validation errors দেখানো
- Import progress indicator
- Success/error summary

```text
┌─────────────────────────────────────────────────────────────┐
│  Bulk Upload Alumni                                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  📁 Drop CSV/Excel file here or click to browse        │ │
│  │                                                         │ │
│  │  [Download Sample Template]                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Preview (5 of 100 rows):                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Name        │ Phone       │ Batch │ Company │ Status │  │
│  │─────────────┼─────────────┼───────┼─────────┼────────│  │
│  │ রহিম উদ্দিন │ 01712345678 │ 2020  │ Huawei  │   ✓    │  │
│  │ করিম খান   │ 01812345678 │ 2021  │ Alibaba │   ✓    │  │
│  │ Invalid Row │             │ abc   │         │   ✗    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Valid: 98 rows  │  Errors: 2 rows                          │
│                                                              │
│  [Cancel]                              [Import 98 Alumni]    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### ধাপ ৪: Sample Template Download
একটি sample CSV template download করার option থাকবে যাতে user সঠিক format জানতে পারে।

**Template columns:**
| Column Name | Required | Example |
|-------------|----------|---------|
| name | Yes | রহিম উদ্দিন |
| phone | No | 01712345678 |
| batch_year | No | 2020 |
| company | No | Huawei Technologies |
| current_position_en | No | Software Engineer |
| current_position_bn | No | সফটওয়্যার ইঞ্জিনিয়ার |
| current_position_zh | No | 软件工程师 |
| story_en | No | My journey... |
| story_bn | No | আমার যাত্রা... |
| story_zh | No | 我的旅程... |

### ধাপ ৫: Admin Page Update

AlumniAdmin.tsx এ যা পরিবর্তন হবে:
1. Phone field যোগ (form এ)
2. Phone display (list এ)
3. Bulk Upload button যোগ
4. Bulk Upload Dialog component integrate

---

## সম্পূর্ণ File List

| Action | File Path | Description |
|--------|-----------|-------------|
| Create | Migration SQL | `phone` column যোগ |
| Create | `src/components/admin/BulkUploadAlumni.tsx` | Bulk upload component |
| Update | `src/pages/admin/AlumniAdmin.tsx` | Phone field + Bulk upload integration |
| Update | `src/pages/Alumni.tsx` | Phone display (optional) |

---

## Technical Details

### CSV Parsing Flow

```text
User uploads file
       │
       ▼
PapaParse reads file
       │
       ▼
Validate each row:
  - name required
  - batch_year must be number
  - phone format check (optional)
       │
       ▼
Show preview with valid/invalid rows
       │
       ▼
User clicks "Import"
       │
       ▼
Batch insert to Supabase
(chunks of 50 for performance)
       │
       ▼
Show success/error summary
```

### Validation Rules

```text
- name: Required, non-empty string
- phone: Optional, allows digits, +, -, spaces
- batch_year: Optional, must be valid year (1900-2100)
- company: Optional string
- position fields: Optional strings
- story fields: Optional strings
```

### Batch Insert Strategy

```text
- Split data into chunks of 50 rows
- Insert each chunk sequentially
- Track success/failure count
- Show progress bar during import
- Report final summary
```

---

## Package Addition

```json
{
  "papaparse": "^5.4.1",
  "@types/papaparse": "^5.3.14"
}
```

---

## সময় অনুমান
- Database migration: ২ মিনিট
- BulkUploadAlumni component: ১৫ মিনিট
- AlumniAdmin update: ১০ মিনিট
- Testing & fixes: ৫ মিনিট

**মোট: ~৩২ মিনিট**
