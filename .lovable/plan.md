# Revised API Plan: Full Information in Bangla

হ্যাঁ, আপনি full information পাবেন — এবং API response বাংলায় দেওয়া হবে।

বর্তমান API প্ল্যানকে একটু পরিবর্তন করে দুইটা endpoint রাখা হবে:

```text
GET /functions/v1/website-public-data?lang=bn&mode=full
GET /functions/v1/website-leads-data?lang=bn&mode=full
```

## What you will get

### 1. Public website data API
এই API থেকে website-এর public content full information সহ বাংলায় পাওয়া যাবে।

Included:
- শিক্ষক/Teachers
- কোর্স/Courses
- বই/Books
- নোটিশ/Notices
- গ্যালারি/Gallery
- ভিডিও/Videos
- Alumni
- Services
- Partners
- Media
- Testimonials
- Navigation
- Site settings
- Hero settings
- Jobs, if needed from existing website data

### 2. Leads/submissions API
এই API আলাদা থাকবে, কারণ এগুলো sensitive/private data।

Included:
- Admission applications
- Contact form submissions
- Newsletter subscribers

## Bangla response format

API response-এ Bengali-readable field names দেওয়া হবে, যেন n8n workflow-তে data বুঝতে সহজ হয়।

Example:

```json
{
  "success": true,
  "language": "bn",
  "mode": "full",
  "generated_at": "2026-04-27T00:00:00.000Z",
  "data": {
    "courses": [
      {
        "আইডি": "...",
        "শিরোনাম": "চাইনিজ ভাষা কোর্স",
        "বিবরণ": "...",
        "সময়কাল": "...",
        "ফি": 5000,
        "ছবি": "...",
        "সক্রিয়": true
      }
    ],
    "admission_applications": [
      {
        "পূর্ণ নাম": "...",
        "ফোন": "...",
        "ইমেইল": "...",
        "ঠিকানা": "...",
        "শিক্ষাগত যোগ্যতা": "...",
        "আবেদনের তারিখ": "...",
        "স্ট্যাটাস": "pending"
      }
    ]
  }
}
```

## Full information behavior

- `lang=bn` দিলে multilingual content-এর Bangla version return হবে।
- `mode=full` দিলে প্রতিটি record-এর সব দরকারি field return হবে।
- যেখানে Bangla translation নেই, সেখানে fallback হিসেবে English value দেওয়া হবে যাতে data blank না হয়।
- Sensitive lead data public content API-এর সাথে mix হবে না।

## Security

দুইটা endpoint-ই secret key দিয়ে protected থাকবে। n8n HTTP Request node-এ header দিতে হবে:

```text
x-api-key: lb_n8n_api_2026_K7mQ9xR4vT2pL8zN5cW3yH6sD1aF0bJ
```

Rules:
- Wrong/missing key হলে `401 Unauthorized`
- Only `GET` and `OPTIONS` allowed
- API key frontend code-এ থাকবে না
- Lead/submission data আলাদা endpoint-এ থাকবে

## n8n setup

n8n-এ দুইটা HTTP Request node ব্যবহার করবেন:

```text
Method: GET
URL: [backend function URL]/website-public-data?lang=bn&mode=full
Header: x-api-key = your secret key
```

```text
Method: GET
URL: [backend function URL]/website-leads-data?lang=bn&mode=full
Header: x-api-key = your secret key
```

Implementation শেষে আমি আপনাকে exact callable URLs এবং n8n setup details দিয়ে দেব।

## Technical implementation

I will create two backend functions:

1. `website-public-data`
   - Reads public website tables
   - Returns active/public content
   - Maps multilingual columns like `title_bn`, `description_bn` into Bangla response fields
   - Supports `lang=bn` and `mode=full`

2. `website-leads-data`
   - Reads admission/contact/newsletter submissions using secure backend access
   - Returns full lead information with Bangla labels
   - Protected by the same secret key

No database schema changes are required for this update.