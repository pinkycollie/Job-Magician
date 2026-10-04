# Getting Started - Visual Guide

## 📋 What You Have

Your MBTQ Lifecycle System MVP is **100% ready to run**. No additional coding needed.

```
FRONTEND                         BACKEND                       DATABASE
Next.js (React)          →      FastAPI (Python)      →       Supabase (PostgreSQL)
  /                             GET /health                    lifecycle_items table
  /lifecycle            ←       GET /lifecycle/list    ←       Indexes
                                POST /lifecycle/create         RLS enabled
                                POST /lifecycle/update-stage
```

---

## 🚀 Get Running in 3 Steps

### Step 1️⃣ Setup Supabase (2 minutes)

1. Go to **https://supabase.com**
2. Create a new project (give it a name)
3. Wait for it to be ready
4. Go to **SQL Editor** → **New Query**
5. Copy ENTIRE contents of `supabase.sql` file from this project
6. Paste it in the query box
7. Click **Run**
8. ✅ You should see "Success. No rows returned"

### Step 2️⃣ Copy Your Credentials (1 minute)

1. In Supabase, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** - looks like `https://abc123xyz.supabase.co`
   - **Anon Key** - long string, NOT the "service_role" one

### Step 3️⃣ Add to v0 Settings (1 minute)

1. Click **Settings** (gear icon, top right)
2. Click **Vars** tab
3. Click **Add** and add TWO variables:
   ```
   SUPABASE_URL = [paste your Project URL here]
   SUPABASE_KEY = [paste your Anon Key here]
   ```
4. Click **Save**

✅ **Done!** Click **Preview** to see it running.

---

## 🎯 What You're Looking At

### Home Page
```
┌─────────────────────────────────┐
│   MBTQ Lifecycle System          │
│                                 │
│   Track and manage your         │
│   product through its           │
│   complete lifecycle.           │
│                                 │
│   [Open Dashboard] ← Click this │
└─────────────────────────────────┘
```

### Dashboard Page
```
┌─────────────────────────────────┐
│ ← Back    Lifecycle Dashboard   │
├─────────────────────────────────┤
│                                 │
│ [Type here......]  [Create]     │
│                                 │
├─────────────────────────────────┤
│                                 │
│ My First Product (gray box)     │
│ Stage: IDEA                     │
│ [idea] [build] [grow]...        │
│                                 │
│ My Second Product (yellow box)  │
│ Stage: BUILD                    │
│ [idea] [build] [grow]...        │
│                                 │
└─────────────────────────────────┘
```

---

## 🧪 Test It Works

1. **Create an Item**
   - Type: "Test Product"
   - Click: "Create"
   - ✅ Should appear in a gray box below

2. **Change Stage**
   - Click: "build" button on your item
   - ✅ Box should turn yellow
   - Box should stay yellow after refresh

3. **Create Another**
   - Type: "Another Item"
   - Click: "Create"
   - ✅ Should appear below first item

4. **Refresh Page**
   - Press: F5 or refresh button
   - ✅ Both items should still be there
   - ✅ Their stages should be preserved

**If all ✅ check marks happen: Congratulations! 🎉**

---

## 🎨 Understanding the Colors

Each stage has a color for quick visual reference:

| Stage | Color | Meaning |
|-------|-------|---------|
| **idea** | Gray | 💭 Concept phase |
| **build** | Yellow | 🔨 Active development |
| **grow** | Blue | 📈 Scaling & expansion |
| **managed** | Green | ✅ Stable operations |
| **sunset** | Red | 🌅 End of life |

Click a button to move your product through the stages.

---

## 📊 What's Happening Behind the Scenes

```
You type "My Product" and click Create
        ↓
   Frontend sends JSON to backend
        ↓
   Backend receives at POST /api/lifecycle/create
        ↓
   Backend connects to Supabase
        ↓
   Supabase inserts row into lifecycle_items table
        ↓
   Backend returns the new item
        ↓
   Frontend adds it to the list on screen
        ↓
   You see your item appear! ✨
```

---

## 🔧 If Something Doesn't Work

### Problem: "Supabase credentials not configured"
```
❌ Error in Preview
↓
Check: Did you add SUPABASE_URL and SUPABASE_KEY to Vars?
       (Settings → Vars tab)
↓
Solution: Copy/paste them again carefully
```

### Problem: "Items don't save"
```
❌ Create item, refresh, it's gone
↓
Check: Did you run supabase.sql successfully?
↓
Solution: Go back to SQL Editor in Supabase
          Run it again, check for errors
```

### Problem: "I can't see the Preview"
```
❌ Preview is loading forever
↓
Check: Wait 10 seconds (services are starting)
↓
Solution: Restart by clicking the refresh button
```

### Problem: "Frontend won't load"
```
❌ Blank page or errors in Preview
↓
Check: Open Preview console (F12)
       Look for error messages
↓
Solution: Try refreshing (Ctrl+R / Cmd+R)
```

---

## 📚 Documentation Files

Each file answers a specific question:

| File | Read If You Want To... |
|------|---|
| **QUICKSTART.md** | Get running in 5 minutes (checklist format) |
| **SETUP.md** | Detailed step-by-step instructions |
| **README.md** | Understand what the system does |
| **API.md** | Call the API endpoints directly |
| **ARCHITECTURE.md** | Understand how it's built |
| **PROJECT_SUMMARY.md** | Get a high-level overview |

---

## 🎓 Learning the Codebase

### If you want to modify the UI:
**File**: `frontend/app/lifecycle/page.tsx` (217 lines)
- It's a single React component
- Uses `useState` for items and form state
- Calls API functions when buttons are clicked
- Handles loading and error states

### If you want to add/modify API endpoints:
**File**: `backend/main.py` (84 lines)
- Each endpoint is a function with `@app.get()` or `@app.post()`
- They receive data, call Supabase, return JSON
- Add new endpoints by copying the pattern

### If you want to modify the database:
**File**: `supabase.sql` (26 lines)
- Single table: `lifecycle_items`
- Has columns for: id, title, stage, workflow_id, data
- Has indexes for performance
- Has RLS for security

### If you want to modify API calls:
**File**: `frontend/lib/api.ts` (37 lines)
- 4 simple functions that call `/api/*` endpoints
- Each uses `fetch()` with proper headers
- Returns JSON

---

## 🚢 Next Steps (When Ready)

### Right Now
✅ Get it running (follow QUICKSTART.md)
✅ Create some items and play around
✅ Understand how stages work

### Next Week
🎯 Add user login (Supabase Auth)
🎯 Restrict items to logged-in user
🎯 Add custom fields (edit `supabase.sql`)

### Next Month
🚀 Add AI suggestions (call Claude API)
🚀 Add automation rules (event system)
🚀 Add metrics dashboard (track time in stages)

---

## ❓ Frequently Asked Questions

**Q: Do I need to run any setup commands?**
A: No! Everything is already set up. Just add credentials and click Preview.

**Q: Can I modify the code?**
A: Yes! All files are editable. Edit in v0, changes auto-save and redeploy.

**Q: Can I download this and use it elsewhere?**
A: Yes! Click the three dots → Download ZIP. You can run it locally with `vercel dev`.

**Q: Is my data secure?**
A: For now, it's public (good for testing). To secure it, we'd add login + user-specific access.

**Q: How many items can I create?**
A: Thousands. Once you have 1000+, we'd add pagination for better performance.

**Q: Can I deploy to production?**
A: Yes! Click "Publish" and connect to GitHub. Vercel will handle deployment.

**Q: What if I find a bug?**
A: Tell me! I can fix it. Common issues are documented in SETUP.md.

**Q: Can I add more features?**
A: Absolutely! That's the whole point. Start with the MVP, add what you need.

---

## 📞 Common Commands (if you use terminal)

If you download and run locally:

```bash
# Install dependencies
cd frontend && pnpm install
cd ../backend && pip install -r requirements.txt (if needed)

# Run locally
vercel dev    # Starts both frontend and backend

# Deploy
vercel        # Deploys to Vercel
```

But you don't need to do this - v0 handles it automatically!

---

## 🎬 Visual Overview

```
                Your Browser
                     |
                     |
         ┌───────────┴───────────┐
         |                       |
    HOME PAGE              DASHBOARD
    (/)                    (/lifecycle)
     |                      |
     |                      |
  - Welcome            - Input form
  - Open Link          - Item list
                       - Stage buttons
                       
         └───────────┬───────────┘
                     |
            Backend API
            /api/*
             |
             | SQL
             |
          Supabase
          (PostgreSQL)
```

---

## ✨ That's It!

You now have a **working product lifecycle system**.

**Next action**: Follow QUICKSTART.md and get it running.

Then enjoy! 🚀

---

**Questions?** Each documentation file has more details. Start with QUICKSTART.md!
