# Project Philosophy

## Architecture Principles

### 1. Immutable Infrastructure for Code

All application code (`app/`, `components/`, `lib/`, etc.) is treated as **immutable** and completely replaced on each deployment. This ensures:

- No stale code remains after updates
- Consistent state across environments
- Easy rollbacks (just redeploy previous commit)

### 2. Mutable Data Protection

User-generated content is sacred and **never** touched by deployments:

- **`public/uploads/`**: Media files uploaded through the admin panel
- **`.env`**: Environment-specific configuration
- **Database**: MongoDB is external and unaffected by code deploys

### 3. Server-Side Builds

All production builds happen on the server, not locally. This ensures:

- Consistent build output regardless of developer machine
- No "works on my machine" issues
- Turbopack optimizations match the production environment

---

## Data Model Philosophy

### Code vs Content Separation

```
┌─────────────────────────────────────────┐
│              CODE (Git)                 │
│  - Components, Pages, API Routes        │
│  - Styles, Scripts, Static Assets       │
│  - Configuration Files                  │
└─────────────────────────────────────────┘
              ↓ Deployed via rsync
┌─────────────────────────────────────────┐
│            CONTENT (Protected)          │
│  - MongoDB: Posts, Products, Users      │
│  - Uploads: /public/uploads/*           │
│  - Config: .env                         │
└─────────────────────────────────────────┘
```

---

## Security Philosophy

### Principle of Least Privilege

- Admin routes are protected by session checks
- Super Admin features (User Management) have additional email/username validation
- Passwords require strong complexity (10+ chars, mixed case, numbers, symbols)

### Defense in Depth

- CSP headers configured in `proxy.ts`
- Cloudflare Turnstile on authentication forms
- CSRF protection via NextAuth.js
- Production URLs hardcoded to prevent localhost leaks

---

## Development Workflow

1. **Local Development**: `npm run dev` with hot reload
2. **Commit**: Push changes to Git
3. **Deploy**: Run `bash scripts/deploy.sh`
4. **Verify**: Check production logs and functionality

---

## Future Considerations

- **Blue-Green Deployments**: For zero-downtime releases
- **Database Migrations**: Versioned schema changes
- **Asset CDN**: Move uploads to external storage (S3/Cloudflare R2)
