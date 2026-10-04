# MBTQ Lifecycle System - Setup Guide

This is a working MVP with **no integrations or env vars added yet**. Follow these steps to get it running.

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up/log in
2. Click "New Project"
3. Fill in details:
   - Name: "mbtq-lifecycle" (or your choice)
   - Password: Generate strong password (save it!)
   - Region: Choose closest to you
4. Wait for project creation (~2 minutes)

## Step 2: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase.sql` from this project
4. Paste it in the query editor
5. Click "Run"
6. You should see: "Success. No rows returned."

## Step 3: Get Your Credentials

1. In Supabase, go to **Settings** → **API**
2. Find and copy:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **Anon public key** (the "public" one, NOT the "service_role" key)
3. Save these somewhere safe

## Step 4: Add Environment Variables in v0

1. In v0, click the **Settings** button (top right)
2. Go to **Vars** tab
3. Click "Add" and add two new variables:
   - **Key**: `SUPABASE_URL` | **Value**: `your_project_url` (paste from step 3)
   - **Key**: `SUPABASE_KEY` | **Value**: `your_anon_key` (paste from step 3)
4. Click Save

## Step 5: Run the Project

1. Click the **Preview** button to see it running
2. The dev server will automatically start both:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api (proxied)
3. If you see errors about missing env vars, double-check step 4

## Verify It Works

1. Go to the preview → "Open Dashboard"
2. You should see the Lifecycle Dashboard
3. Create a new item by typing a title and clicking "Create"
4. If it works, you should see the item appear with a gray "Idea" stage
5. Click stage buttons to move items through: Idea → Build → Grow → Managed → Sunset
6. Refresh the page - items should persist (this means Supabase is working!)

## Troubleshooting

### "Supabase credentials not configured" error
- Check that SUPABASE_URL and SUPABASE_KEY are set in v0 settings
- Make sure you copied the **anon key**, not the service_role key

### Items don't save after refresh
- Check Supabase SQL executed successfully (no errors in step 2)
- Verify the table `lifecycle_items` exists in Supabase: SQL Editor → Tables dropdown

### Backend API not responding
- Check that both services started: Preview → Console should show both running
- Verify Supabase credentials are correct

### CORS or network errors
- The frontend calls `/api/lifecycle/*` which is proxied to the backend
- This should work automatically through the multi-service setup

## What's Next?

Once this MVP is working, you can add:

1. **User Authentication** (Supabase Auth)
2. **AI Stage Progression** (Claude API)
3. **Event Bus** (for automation)
4. **Webhooks** (to external services)
5. **Metrics Dashboard** (time tracking, transitions)

See README.md for full feature roadmap.

## Project Architecture

```
┌─────────────────────────────────────────┐
│        Next.js Frontend (React)          │
│   http://localhost:3000                  │
│  - Lifecycle dashboard                   │
│  - Input form, stage buttons             │
│  - Fetches from /api/*                   │
└──────────────┬──────────────────────────┘
               │ /api/* (proxied)
┌──────────────▼──────────────────────────┐
│      FastAPI Backend (Python)            │
│   http://localhost:8000                  │
│  - REST endpoints                        │
│  - Supabase integration                  │
│  - CRUD operations                       │
└──────────────┬──────────────────────────┘
               │ SQL queries
┌──────────────▼──────────────────────────┐
│    Supabase (PostgreSQL)                 │
│  - lifecycle_items table                 │
│  - Row-level security enabled            │
│  - Automatic timestamps                  │
└──────────────────────────────────────────┘
```

Both frontend and backend services run in parallel via the multi-service setup in `vercel.json`.
