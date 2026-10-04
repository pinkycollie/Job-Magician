# MBTQ Lifecycle System MVP

A minimal, fully functional product lifecycle management system built with FastAPI, Next.js, and Supabase.

## Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Next.js 16 (React 19)
- **Database**: Supabase (PostgreSQL)

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   └── pyproject.toml       # Python dependencies
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Home page
│   │   └── lifecycle/
│   │       └── page.tsx     # Lifecycle dashboard
│   ├── lib/
│   │   └── api.ts           # API client
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── vercel.json              # Multi-service configuration
└── supabase.sql             # Database schema
```

## Setup Instructions

### 1. Configure Supabase

1. Create a new Supabase project at https://supabase.com
2. In your Supabase dashboard:
   - Go to **SQL Editor**
   - Create a new query
   - Copy the contents of `supabase.sql` and run it to create the `lifecycle_items` table
3. Get your credentials:
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → Project API keys (use the anon/public key)

### 2. Add Environment Variables

In your v0 project settings (top-right), go to **Vars** and add:

```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
```

### 3. Run Locally

The multi-service setup runs automatically:

```bash
# Frontend dev server will be on http://localhost:3000
# Backend API will be accessible at http://localhost:3000/api
# Both services are managed by vercel dev (automatic in sandbox)
```

## API Endpoints

All endpoints are prefixed with `/api`:

- `GET /api/health` - Health check
- `GET /api/lifecycle/list` - List all lifecycle items
- `POST /api/lifecycle/create` - Create a new item
  - Body: `{ title: string, workflow_id?: string, data?: object }`
- `POST /api/lifecycle/update-stage` - Update item stage
  - Body: `{ id: string, stage: string }`

## Stages

Items progress through these lifecycle stages:

1. **Idea** - Initial concept
2. **Build** - Active development
3. **Grow** - Scaling and expansion
4. **Managed** - Stable, ongoing operations
5. **Sunset** - Deprecation or end of life

## What This MVP Includes

✓ Full CRUD operations for lifecycle items  
✓ Stage transitions with visual feedback  
✓ Persistent storage with Supabase  
✓ Error handling and loading states  
✓ Mobile-responsive UI  
✓ Type-safe frontend (TypeScript)  
✓ RESTful backend with proper validation  

## What's NOT Included (Yet)

- AI-powered stage progression
- Event bus / automation layer
- Advanced routing engine
- Real-time updates (WebSockets)
- User authentication
- Metrics/analytics tracking

These can be added based on your needs!

## Next Steps

Once this MVP is working:

1. **Add Authentication** - Implement user management with Supabase Auth
2. **Add AI Automation** - Use Claude/GPT to suggest stage transitions
3. **Add Event Bus** - Implement pub/sub for lifecycle events
4. **Add Real-time** - WebSocket updates for live dashboard
5. **Add Metrics** - Track time in each stage, transition patterns, etc.

## Deployment

To deploy to Vercel:

1. Push your code to a GitHub repository
2. In v0, click **Publish** and connect to your GitHub repo
3. Vercel will detect the `experimentalServices` configuration and deploy both services automatically
4. Set environment variables in Vercel dashboard: Settings → Environment Variables
