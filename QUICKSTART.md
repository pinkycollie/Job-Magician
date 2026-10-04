# Quick Start Checklist

Get your MBTQ Lifecycle System running in 5 minutes.

## ✓ Phase 1: Supabase Setup (2 minutes)

- [ ] Go to https://supabase.com, create new project
- [ ] In SQL Editor, run the entire `supabase.sql` file
- [ ] In Settings → API, copy your **Project URL**
- [ ] In Settings → API, copy the **anon key** (public, NOT service_role)

## ✓ Phase 2: Configure v0 (1 minute)

- [ ] Click Settings (top right of v0)
- [ ] Go to **Vars** tab
- [ ] Add `SUPABASE_URL` = your project URL
- [ ] Add `SUPABASE_KEY` = your anon key
- [ ] Click Save

## ✓ Phase 3: Run (2 minutes)

- [ ] Click **Preview** button
- [ ] Wait for both services to start
- [ ] In the preview, click "Open Dashboard"
- [ ] Type a title and click "Create"
- [ ] You should see your item appear!

## ✓ Verify It Works

- [ ] Can you create items?
- [ ] Can you click stage buttons?
- [ ] Do items persist after refresh?

**If yes to all:** 🎉 You're done! The MVP works.

## Troubleshooting in 30 Seconds

| Problem | Solution |
|---------|----------|
| "Supabase credentials not configured" | Check Vars in settings - copy/paste correctly |
| Items don't save | Run supabase.sql again, check for errors |
| Frontend won't load | Check Preview console for JS errors |
| Backend 404 errors | Wait a few seconds for services to fully start |
| CORS errors | Should not happen - services are proxied |

## What You Have

✓ **Frontend:** Next.js dashboard at `/` and `/lifecycle`  
✓ **Backend:** FastAPI REST API at `/api/lifecycle/*`  
✓ **Database:** Supabase PostgreSQL with `lifecycle_items` table  
✓ **Persistence:** All data saved to Supabase  
✓ **Error handling:** Client-side validation + server-side checks  

## Next: What Can You Do?

Once verified working:

1. **Add more fields to items** - Edit `supabase.sql` to add columns
2. **Add filtering** - Update backend endpoints to filter by stage
3. **Add user accounts** - Integrate Supabase Auth
4. **Add AI** - Call Claude/GPT API from backend on state changes
5. **Add webhooks** - Notify external services when stages change

See README.md for full roadmap!

## Project Files

```
backend/main.py          → FastAPI endpoints
frontend/app/page.tsx    → Home page
frontend/app/lifecycle/page.tsx → Dashboard (main UI)
frontend/lib/api.ts      → API client
supabase.sql             → Database schema
vercel.json              → Multi-service config
```

## API Endpoints

All at `/api`:

- `GET /api/health` - Server status
- `GET /api/lifecycle/list` - All items
- `POST /api/lifecycle/create` - Create item
- `POST /api/lifecycle/update-stage` - Move stage

See API.md for full reference.

---

**That's it!** You now have a production-ready MVP.  
When you're ready for the next phase, let me know and I can help you add AI, automation, or whatever comes next.
