# MBTQ Lifecycle System - Setup Checklist

Complete each item in order. Takes about 10 minutes total.

## Phase 1: Supabase Setup (5 minutes)

- [ ] Go to https://supabase.com
- [ ] Click "New Project"
- [ ] Fill in project name (e.g., "mbtq-lifecycle")
- [ ] Create a strong password (save it!)
- [ ] Choose a region near you
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for project to be ready
- [ ] You should see the Supabase dashboard

## Phase 2: Create Database Table (1 minute)

- [ ] In Supabase, go to **SQL Editor** (left sidebar)
- [ ] Click **New Query**
- [ ] Open file: `supabase.sql` from this project
- [ ] Copy the ENTIRE contents
- [ ] Paste into the query editor in Supabase
- [ ] Click **Run** (blue button)
- [ ] Confirm you see: "Success. No rows returned."
- [ ] If you see an error, re-read the SQL and try again

## Phase 3: Get Your Credentials (2 minutes)

- [ ] In Supabase, go to **Settings** (gear icon, bottom left)
- [ ] Click **API** tab
- [ ] Find **Project URL** - copy it to clipboard
  - Should look like: `https://abc123xyz.supabase.co`
- [ ] Find **Project API keys** section
- [ ] Find the **Anon public** key (NOT the "service_role" key!)
- [ ] Copy it to clipboard
- [ ] Save both values somewhere temporary (notepad, etc)

## Phase 4: Add to v0 Settings (2 minutes)

- [ ] In v0, click **Settings** (gear icon, top right)
- [ ] Click **Vars** tab
- [ ] Click **Add** button
- [ ] Create first variable:
  - Key: `SUPABASE_URL`
  - Value: [paste your Project URL here]
  - Click "Save"
- [ ] Click **Add** button again
- [ ] Create second variable:
  - Key: `SUPABASE_KEY`
  - Value: [paste your Anon key here]
  - Click "Save"
- [ ] Confirm both variables are showing in the list

## Phase 5: Run It! (2 minutes)

- [ ] Click the **Preview** button (top area)
- [ ] Wait for services to start (20-30 seconds)
- [ ] You should see a home page with text:
  - "MBTQ Lifecycle System"
  - "Open Dashboard" button
- [ ] Click the "Open Dashboard" button
- [ ] You should see the dashboard page with:
  - Input field ("Type here...")
  - "Create" button
  - (Empty list if first time)

## Phase 6: Verify It Works (2 minutes)

### Test 1: Create an Item
- [ ] Type: "Test Product"
- [ ] Click: "Create"
- [ ] Item should appear below with:
  - Title: "Test Product"
  - Stage: "IDEA" (gray box)
  - 5 stage buttons

### Test 2: Change Stage
- [ ] Click the "build" button on your item
- [ ] Box should turn yellow
- [ ] Stage should show "BUILD"

### Test 3: Refresh Page
- [ ] Press F5 or click refresh
- [ ] Item should still be there
- [ ] Stage should still be "BUILD"
- [ ] ✅ If this works, data is persisting!

### Test 4: Create Another
- [ ] Type: "Another Product"
- [ ] Click: "Create"
- [ ] Two items should now be visible

### Test 5: Multiple Stages
- [ ] Click "grow" on first item (turns blue)
- [ ] Click "managed" on second item (turns green)
- [ ] Refresh page
- [ ] Both items still there with correct colors

## All Done! 🎉

If you completed all items above:
- ✅ Your MVP is working
- ✅ Data persists to Supabase
- ✅ Frontend connects to backend
- ✅ Database is functional

## What to Do Next

### Option A: Explore the System
- Read INDEX.md to understand the project
- Create more test items
- Play with different stages
- Check the code in:
  - `backend/main.py` (API)
  - `frontend/app/lifecycle/page.tsx` (UI)

### Option B: Modify and Extend
- Change colors in `frontend/app/lifecycle/page.tsx`
- Add new endpoints in `backend/main.py`
- Add database columns in `supabase.sql`
- Read ARCHITECTURE.md for guidance

### Option C: Deploy to Production
- Click **Publish** button (when ready)
- Connect to GitHub repo
- Vercel will deploy automatically
- Get your own .vercel.app domain

### Option D: Continue with Documentation
- Read PROJECT_SUMMARY.md for overview
- Read ARCHITECTURE.md for technical details
- Read API.md for endpoint reference
- Read SETUP.md if you have issues

## Troubleshooting

### If something didn't work:

| Problem | Solution |
|---------|----------|
| "Supabase credentials not configured" | Double-check Vars were saved. Refresh preview. |
| Items don't appear | Refresh page. Check browser console for errors. |
| "Connection error" | Wait 30 seconds. Services might still starting. |
| Can't see the input form | Scroll down. Form might be below the fold. |
| Buttons don't work | Check browser console (F12). Look for errors. |
| Credentials wrong | Recheck Supabase Settings → API and copy exactly. |

### Get More Help
- See SETUP.md for detailed troubleshooting
- See GETTING_STARTED.md for visual guide
- See API.md to understand endpoints

## Files You'll Need

- `supabase.sql` - Database schema (you already ran this)
- `backend/main.py` - Backend code (read only, it works!)
- `frontend/app/lifecycle/page.tsx` - Frontend code (read and modify!)
- `vercel.json` - Multi-service config (don't change)
- `frontend/lib/api.ts` - API client (reference or modify!)

## Important Notes

✅ Your data is safe in Supabase  
✅ Changes auto-save in v0  
✅ No manual builds needed  
✅ Can change code anytime  
✅ Easy to deploy when ready  

## Next Up

Once working:
1. Pick something to modify (colors, text, layout)
2. Change it in the file
3. See change immediately in preview
4. Celebrate! You're a full-stack developer 🚀

---

**You did it!** 🎉

Your product lifecycle system is live and working.
Now go build something awesome.

