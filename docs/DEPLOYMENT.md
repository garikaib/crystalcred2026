# Deployment Strategy

## Overview

CrystalCred uses a **hot-patch deployment** strategy that safely updates code while preserving user-generated content (uploads, database entries, runtime configurations).

---

## Core Principles

| Category | Path Examples | Behavior |
|----------|---------------|----------|
| **Immutable (Code)** | `app/`, `components/`, `lib/`, `models/`, `scripts/`, `public/*.ico` | Overwritten on every deploy |
| **Mutable (User Data)** | `public/uploads/`, `.env` | **Never overwritten** |
| **Build Artifacts** | `.next/`, `node_modules/` | Rebuilt on server |

---

## Deployment Flow

```
Local Machine                          Remote Server
─────────────                          ─────────────
1. Create archive (excl. node_modules, .git, .next)
2. Transfer archive via rsync ──────────────────────►
                                       3. Extract to staging dir
                                       4. rsync to app dir (with exclusions)
                                       5. npm ci
                                       6. npm run build
                                       7. Ensure uploads directory exists
                                       8. Fix permissions
                                       9. pm2 restart
                                       10. Purge caches
```

---

## Key rsync Exclusions

The deployment script uses these exclusions to protect mutable data:

```bash
rsync --exclude 'public/uploads/' \
      --exclude '.env' \
      --exclude 'node_modules/' \
      --exclude '.next/'
```

---

## Permissions

After deployment, ownership is set to the deploy user:

```bash
sudo chown -R $REMOTE_USER:$REMOTE_USER $REMOTE_DIR
```

The `public/uploads/` directory is explicitly created with:

```bash
mkdir -p $REMOTE_DIR/public/uploads
```

---

## Running a Deployment

```bash
# From project root
bash scripts/deploy.sh
```

### Options

- `--skip-build`: Skip both local and remote build (for emergency patches)

---

## Media Sync (Dev → Prod)

To push local development media to production **without overwriting** existing files:

```bash
rsync -avz --ignore-existing \
    public/uploads/ \
    ubuntu@51.195.252.90:/var/www/next.crystalcred.co.zw/public/uploads/
```

---

## Troubleshooting

### Uploads directory missing
The API route and deploy script both create this directory automatically. If issues persist, manually run:

```bash
ssh ubuntu@51.195.252.90 "mkdir -p /var/www/next.crystalcred.co.zw/public/uploads"
```

### Permission denied on uploads
```bash
ssh ubuntu@51.195.252.90 "sudo chown -R ubuntu:ubuntu /var/www/next.crystalcred.co.zw/public/uploads"
```
