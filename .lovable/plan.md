# Revised n8n API Plan: Public Data and Leads Separate

ঠিক বলেছেন — lead/submission data আলাদা রাখা ভালো, কারণ এগুলো private/sensitive data. তাই API দুই ভাগে করা হবে।

## What will be built

### 1. Public website data API
For normal website content:

```text
GET /functions/v1/website-public-data
```

This will return public/non-sensitive website data only.

Included data:
- Teachers
- Courses
- Books
- Notices
- Gallery
- Videos
- Alumni
- Services
- Partners
- Media
- Testimonials
- Navigation items
- Site settings
- Hero settings

Example response:

```json
{
  "success": true,
  "generated_at": "2026-04-27T00:00:00.000Z",
  "data": {
    "teachers": [],
    "courses": [],
    "books": [],
    "notices": [],
    "gallery": [],
    "videos": [],
    "alumni": [],
    "services": [],
    "partners": [],
    "media": [],
    "testimonials": [],
    "navigation": [],
    "site_settings": [],
    "hero_settings": []
  }
}
```

---

### 2. Leads/submissions API
For sensitive lead data:

```text
GET /functions/v1/website-leads-data
```

This will return only submission/lead data.

Included data:
- Admission applications
- Contact submissions
- Newsletter subscribers

Example response:

```json
{
  "success": true,
  "generated_at": "2026-04-27T00:00:00.000Z",
  "data": {
    "admission_applications": [],
    "contact_submissions": [],
    "newsletter_subscribers": []
  }
}
```

---

## Security approach

Both APIs will be protected by secret key, but keeping leads separate gives better control.

n8n will call the APIs with:

```text
x-api-key: YOUR_SECRET_KEY
```

Security rules:
- Missing/wrong API key returns `401 Unauthorized`
- Only `GET` and `OPTIONS` methods allowed
- Lead data will never be mixed with public content API
- Secret key will be stored securely in Lovable Cloud backend secrets
- No API key will be exposed in frontend code

---

## n8n workflow setup

You can use two separate **HTTP Request** nodes in n8n:

### Public data node
```text
Method: GET
URL: https://fllbvdhwnwwiqkevnakg.supabase.co/functions/v1/website-public-data
Header:
  x-api-key: your-secret-api-key
```

### Leads data node
```text
Method: GET
URL: https://fllbvdhwnwwiqkevnakg.supabase.co/functions/v1/website-leads-data
Header:
  x-api-key: your-secret-api-key
```

---

## Files to create/update

| Action | File |
|---|---|
| Create | `supabase/functions/website-public-data/index.ts` |
| Create | `supabase/functions/website-leads-data/index.ts` |
| Optional update | `supabase/config.toml` only if function-specific config is required |

---

## Implementation note

During implementation I’ll request one secure API key secret for n8n access. After that I’ll create and deploy both backend functions, then provide the final endpoint URLs and header details for your n8n workflow.