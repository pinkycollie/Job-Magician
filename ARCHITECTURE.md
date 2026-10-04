# MBTQ Lifecycle System - Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser                                   │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 │ HTTP/HTTPS
                 │
┌────────────────▼─────────────────────────────────────────────────┐
│                      Vercel (vercel.dev)                          │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │        Frontend Service (port 3000)                         │ │
│  │        Next.js 16 + React 19                               │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Pages:                                             │  │ │
│  │  │  - / (home - "Open Dashboard" link)                 │  │ │
│  │  │  - /lifecycle (main dashboard)                      │  │ │
│  │  │    * Input form for new items                       │  │ │
│  │  │    * List all items with stage buttons              │  │ │
│  │  │    * Color-coded by stage                           │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  State Management:                                  │  │ │
│  │  │  - useState for items, loading, error               │  │ │
│  │  │  - Direct API calls via fetch()                     │  │ │
│  │  │  - Auto-refresh after mutations                     │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │        API Route Prefix: /api                              │ │
│  │        (Proxied to Backend Service)                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                      ↓ HTTP Proxy                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │        Backend Service (internal port)                      │ │
│  │        FastAPI (Python)                                     │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Endpoints:                                         │  │ │
│  │  │  - GET  /health                                     │  │ │
│  │  │  - GET  /lifecycle/list                             │  │ │
│  │  │  - POST /lifecycle/create                           │  │ │
│  │  │  - POST /lifecycle/update-stage                     │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  CORS Middleware:                                   │  │ │
│  │  │  - Allows all origins (*)                           │  │ │
│  │  │  - Allows all methods (GET, POST, etc)              │  │ │
│  │  │  - Allows all headers                               │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Request Validation:                                │  │ │
│  │  │  - Pydantic models for type safety                  │  │ │
│  │  │  - LifecycleItemCreate (title, workflow_id, data)   │  │ │
│  │  │  - LifecycleItemUpdate (id, stage)                  │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Error Handling:                                    │  │ │
│  │  │  - HTTPException for API errors                     │  │ │
│  │  │  - Try/catch for database errors                    │  │ │
│  │  │  - 400/500 status codes                             │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 │ SQL Queries
                 │
┌────────────────▼─────────────────────────────────────────────────┐
│                   Supabase (Cloud)                                │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │     PostgreSQL Database                                     │ │
│  │                                                              │ │
│  │     lifecycle_items table:                                  │ │
│  │     ┌─────────────────────────────────────────────────────┐ │ │
│  │     │ Column        │ Type        │ Notes                 │ │ │
│  │     ├─────────────────────────────────────────────────────┤ │ │
│  │     │ id            │ UUID        │ Primary key           │ │ │
│  │     │ title         │ TEXT        │ Item title            │ │ │
│  │     │ stage         │ TEXT        │ Enum: idea|build|...  │ │ │
│  │     │ workflow_id   │ TEXT        │ Group items           │ │ │
│  │     │ data          │ JSONB       │ Custom data           │ │ │
│  │     │ metrics       │ JSONB       │ Reserved              │ │ │
│  │     │ created_at    │ TIMESTAMP   │ Auto-generated        │ │ │
│  │     │ updated_at    │ TIMESTAMP   │ Auto-generated        │ │ │
│  │     └─────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  │     Indexes:                                                │ │
│  │     - stage (for filtering by stage)                        │ │
│  │     - workflow_id (for grouping)                            │ │
│  │     - created_at (for sorting)                              │ │
│  │                                                              │ │
│  │     Row Level Security (RLS):                               │ │
│  │     - Public access enabled (no auth required for MVP)      │ │
│  │     - Can be restricted per user later                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │     Environment                                             │ │
│  │     - SUPABASE_URL (project URL)                            │ │
│  │     - SUPABASE_KEY (anon public key)                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Create Item Flow

```
User Types Title
        ↓
   [Input Component]
        ↓
   [handleCreate()]
        ↓
   POST /api/lifecycle/create
   {title: "New Item", workflow_id: "default", data: {}}
        ↓
   [Backend: FastAPI]
   - Validate request (Pydantic)
   - Connect to Supabase
   - Insert into lifecycle_items table
   - Return inserted item
        ↓
   [Frontend: React]
   - Update local state
   - Call load() to refresh list
   - Clear input field
        ↓
   GET /api/lifecycle/list
        ↓
   [Backend: FastAPI]
   - Query lifecycle_items table
   - Sort by created_at DESC
   - Return array of items
        ↓
   [Frontend: React]
   - setItems(data)
   - Component re-renders with new item
        ↓
   Item appears on screen with stage buttons
```

### Update Stage Flow

```
User Clicks Stage Button
        ↓
   [onClick Handler]
   handleUpdateStage(itemId, newStage)
        ↓
   POST /api/lifecycle/update-stage
   {id: "uuid", stage: "build"}
        ↓
   [Backend: FastAPI]
   - Validate request
   - Update where id = provided_id
   - Set stage = provided_stage
   - Return updated item
        ↓
   [Frontend: React]
   - Call load() to refresh
        ↓
   GET /api/lifecycle/list (same as above)
        ↓
   Item's color changes based on new stage
   Button for current stage becomes highlighted
```

## Technology Stack Details

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Inline CSS (no CSS framework, minimal)
- **State**: React hooks (useState, useEffect)
- **API**: Fetch API (no external HTTP library)

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn (ASGI)
- **Language**: Python 3.9+
- **Validation**: Pydantic
- **Database Driver**: Supabase Python SDK

### Database
- **Platform**: Supabase (managed PostgreSQL)
- **ORM**: None (raw SQL queries)
- **Auth**: RLS (Row Level Security, not auth in MVP)
- **Backups**: Automatic (Supabase feature)

### Deployment
- **Platform**: Vercel
- **Services**: Multi-service setup (frontend + backend)
- **Config**: vercel.json with experimentalServices
- **Env Vars**: SUPABASE_URL, SUPABASE_KEY

## Lifecycle Stages

```
idea → build → grow → managed → sunset
 ↓      ↓       ↓       ↓         ↓
🔵     🟡      🔵      🟢        🔴

Colors in UI:
idea    = Gray (#e0e0e0)
build   = Yellow (#ffeb99)
grow    = Blue (#99ccff)
managed = Green (#99ff99)
sunset  = Red (#ff9999)
```

## Error Handling Architecture

```
Frontend
├── Network errors: Caught by .catch(), displayed to user
├── Validation errors: Check input before API call
└── API errors: Parse .detail from response

Backend
├── Request validation: Pydantic automatic validation
├── Database errors: Caught in try/except, return 400/500
└── Missing config: Check env vars at startup

Supabase
├── SQL errors: Propagate to backend error handler
├── RLS violations: Return 403 (not applicable in MVP)
└── Connection errors: Return 500 from backend
```

## Scalability Notes

**Current MVP is suitable for:**
- Personal use / small teams
- Learning / prototyping
- Up to ~1000 items (no pagination)

**For production scaling, add:**
- [ ] Pagination (limit/offset in API)
- [ ] Caching (Redis via Upstash)
- [ ] Full-text search (PostgreSQL FTS)
- [ ] Pagination indexes on created_at
- [ ] Connection pooling (via Supabase)
- [ ] Rate limiting (API Gateway)
- [ ] Authentication (Supabase Auth)
- [ ] Audit logging (PostgreSQL triggers)

## File Organization

```
backend/
├── main.py              ← All FastAPI code (can split later)
└── pyproject.toml       ← Python dependencies

frontend/
├── app/
│   ├── layout.tsx       ← Root layout, metadata
│   ├── page.tsx         ← Home page with link
│   └── lifecycle/
│       └── page.tsx     ← Main dashboard (217 lines)
├── lib/
│   └── api.ts          ← API client functions (37 lines)
├── package.json        ← Next.js dependencies
├── next.config.ts      ← Next.js configuration
└── tsconfig.json       ← TypeScript configuration

Root files:
├── vercel.json         ← Multi-service configuration
├── package.json        ← Root scripts (dev, build, start)
├── supabase.sql        ← Database schema
├── README.md           ← Full documentation
├── SETUP.md            ← Setup instructions
├── QUICKSTART.md       ← Quick start checklist
├── API.md              ← API reference
└── ARCHITECTURE.md     ← This file
```

## Configuration Files

### vercel.json (Multi-Service Setup)
```json
{
  "experimentalServices": {
    "backend": {
      "entrypoint": "backend/main.py",
      "routePrefix": "/api"
    },
    "frontend": {
      "entrypoint": "frontend/next.config.ts"
    }
  }
}
```

### Environment Variables
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your_anon_key
```

Both set in v0 project settings → Vars

## Database Schema

Single table, fully normalized for this MVP:

```sql
create table lifecycle_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  stage text default 'idea',
  workflow_id text default 'default',
  data jsonb default '{}',
  metrics jsonb default '{}',
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

For future use:
- `metrics` field reserved for: time_in_stage, transition_count, etc.
- `data` field for: custom attributes, team assignment, priority, etc.
- `workflow_id` field for: grouping items in different workflows

## Next Steps for Enhancement

1. **Add User Auth** → Supabase Auth + RLS policies
2. **Add Filtering** → GET /lifecycle/list?stage=build&workflow_id=feature_xyz
3. **Add Pagination** → GET /lifecycle/list?limit=10&offset=0
4. **Add Search** → GET /lifecycle/list?search=keyword
5. **Add AI** → POST /lifecycle/suggest-stage calls Claude API
6. **Add Webhooks** → Notify external services on stage changes
7. **Add Metrics** → Track time in each stage, transition patterns
8. **Add Real-time** → WebSocket for live updates across clients
