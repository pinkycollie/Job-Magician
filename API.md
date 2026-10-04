# MBTQ Lifecycle System - API Reference

All API endpoints are available at `/api/*` when running locally.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.vercel.app/api`

## Endpoints

### Health Check

```
GET /api/health
```

Returns server status.

**Response:**
```json
{
  "status": "ok"
}
```

---

### List All Items

```
GET /api/lifecycle/list
```

Returns all lifecycle items, sorted by creation date (newest first).

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Product Launch",
    "stage": "build",
    "workflow_id": "default",
    "data": {},
    "created_at": "2025-05-08T10:30:00.000Z"
  }
]
```

---

### Create Item

```
POST /api/lifecycle/create
Content-Type: application/json
```

Creates a new lifecycle item.

**Request Body:**
```json
{
  "title": "New Feature",
  "workflow_id": "default",
  "data": {}
}
```

**Parameters:**
- `title` (required, string): Item name
- `workflow_id` (optional, string): Workflow identifier, defaults to "default"
- `data` (optional, object): Custom data to store with the item

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "New Feature",
  "stage": "idea",
  "workflow_id": "default",
  "data": {},
  "created_at": "2025-05-08T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (missing title, database error, etc.)
- `500` - Server error (Supabase not configured)

---

### Update Stage

```
POST /api/lifecycle/update-stage
Content-Type: application/json
```

Moves an item to a new lifecycle stage.

**Request Body:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "stage": "build"
}
```

**Parameters:**
- `id` (required, string): UUID of the item to update
- `stage` (required, string): New stage - one of: `idea`, `build`, `grow`, `managed`, `sunset`

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "New Feature",
  "stage": "build",
  "workflow_id": "default",
  "data": {},
  "created_at": "2025-05-08T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (invalid stage, item not found, database error)
- `500` - Server error (Supabase not configured)

---

## Data Models

### LifecycleItem

```typescript
{
  id: string;              // UUID, auto-generated
  title: string;           // Item name/description
  stage: string;           // One of: idea, build, grow, managed, sunset
  workflow_id: string;     // Workflow identifier (default: "default")
  data: Record<string, any>;  // Custom JSON data
  metrics?: Record<string, any>; // Reserved for future use
  created_at: string;      // ISO 8601 timestamp
  updated_at?: string;     // ISO 8601 timestamp (when stage changed)
}
```

### Lifecycle Stages

1. **idea** - Concept phase, gathering requirements
2. **build** - Active development and implementation
3. **grow** - Scaling, optimization, feature expansion
4. **managed** - Stable operations, maintenance mode
5. **sunset** - Deprecation, wind-down, end of life

---

## Error Responses

All errors return JSON with this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Errors

#### Missing Supabase Credentials
```json
{
  "detail": "Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_KEY environment variables."
}
```
**Solution:** Add `SUPABASE_URL` and `SUPABASE_KEY` to v0 project settings → Vars

#### Missing Required Field
```json
{
  "detail": "Request validation error"
}
```
**Solution:** Check that all required fields are present in your request

#### Item Not Found
```json
{
  "detail": "Item with id 'xxx' not found"
}
```
**Solution:** Verify the ID exists by listing items first

#### Invalid Stage
```json
{
  "detail": "Invalid stage. Must be one of: idea, build, grow, managed, sunset"
}
```
**Solution:** Use one of the five valid stage values

---

## Examples

### JavaScript/TypeScript Client

```typescript
// Create item
const response = await fetch('/api/lifecycle/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Feature',
    data: { team: 'engineering', priority: 'high' }
  })
});
const newItem = await response.json();

// Update stage
await fetch('/api/lifecycle/update-stage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: newItem.id,
    stage: 'build'
  })
});

// List all
const allItems = await fetch('/api/lifecycle/list').then(r => r.json());
```

### cURL

```bash
# Create
curl -X POST http://localhost:3000/api/lifecycle/create \
  -H "Content-Type: application/json" \
  -d '{"title":"My Idea"}'

# Update
curl -X POST http://localhost:3000/api/lifecycle/update-stage \
  -H "Content-Type: application/json" \
  -d '{"id":"550e8400-e29b-41d4-a716-446655440000","stage":"build"}'

# List
curl http://localhost:3000/api/lifecycle/list
```

### Python (requests)

```python
import requests

BASE_URL = "http://localhost:3000/api"

# Create
response = requests.post(
    f"{BASE_URL}/lifecycle/create",
    json={"title": "My Idea"}
)
item = response.json()

# Update
requests.post(
    f"{BASE_URL}/lifecycle/update-stage",
    json={"id": item["id"], "stage": "build"}
)

# List
items = requests.get(f"{BASE_URL}/lifecycle/list").json()
```

---

## Rate Limiting

No rate limiting is implemented in this MVP. Production deployments should add rate limiting via:
- Supabase RLS policies
- API gateway (e.g., AWS API Gateway)
- Custom middleware

---

## CORS

CORS is enabled for all origins (`*`) in development. This should be restricted in production to your domain only.

---

## Future Enhancements

- [ ] Pagination for list endpoint
- [ ] Filtering by stage, workflow_id, date range
- [ ] Bulk operations (create/update multiple)
- [ ] Full-text search
- [ ] Webhook notifications on stage changes
- [ ] Audit logging
- [ ] Authentication & authorization
