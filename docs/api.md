# API conventions

The API is versioned under `/api/v1`. The current endpoints are:

| Method | Path                   | Purpose            |
| ------ | ---------------------- | ------------------ |
| `GET`  | `/api/v1/health`       | Process liveness   |
| `GET`  | `/api/v1/health/ready` | Database readiness |

No task CRUD or task workflow endpoints are part of this initialization.

Successful responses use `{ "data": ... }`. Errors use `{ "error": { "code": "...", "message": "...", "requestId": "...", "details": [...] } }`; `details` is included for request validation errors. The API limits JSON request bodies to 1 MiB and applies the configured web origin, Helmet security headers, and rate limiting to versioned routes.

Use the shared Zod schemas for request and response contracts. `validateBody` rejects invalid input with a structured 400 response and makes parsed data available to downstream handlers. Keep route handlers thin, use the shared response envelopes, and avoid returning internal exception details.
