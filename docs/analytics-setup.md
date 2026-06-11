# Analytics Setup — Umami (Self-Hosted)

## Overview

[Umami](https://umami.is/) is a self-hosted, privacy-friendly, open-source web analytics platform. It was chosen for this project because:

- **Self-hosted** — full data ownership, no third-party data sharing
- **Privacy-friendly** — complies with GDPR without cookie banners; no personal data collected
- **Lightweight** — the tracking script is ~2 KB, much smaller than Google Analytics
- **Free and open-source** — MIT licensed, no usage limits
- **Simple dashboard** — page views, visitors, referrers, countries, devices, browsers

## Prerequisites

- A Linux server with Docker and Docker Compose installed
- A domain or subdomain for the analytics dashboard (e.g., `analytics.example.com`)
- Ports 80 and 443 open on the server firewall

## Docker Compose Setup

Create a `docker-compose.yml` file with the following contents:

```yaml
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://umami:umami@db:5432/umami
      UMAMI_APP_SECRET: '<replace-with-generated-secret>'
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ['CMD-SHELL', 'curl -f http://localhost:3000/api/heartbeat']
      interval: 30s
      timeout: 5s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami
    volumes:
      - umami-db:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U umami']
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  umami-db:
```

### Generate the App Secret

Run the following command to generate a secure value for `UMAMI_APP_SECRET`:

```bash
openssl rand -base64 32
```

Replace `<replace-with-generated-secret>` in the compose file with the generated value.

### Security Note

For production use, replace the default PostgreSQL credentials (`umami:umami`) with strong, unique values. Update both the `POSTGRES_USER`, `POSTGRES_PASSWORD`, and the `DATABASE_URL` connection string accordingly.

## Configuration

### 1. Deploy Umami

1. Copy the `docker-compose.yml` to your server (e.g., `/opt/umami/docker-compose.yml`)
2. Generate and set the `UMAMI_APP_SECRET` as described above
3. Start the services:

   ```bash
   cd /opt/umami
   docker compose up -d
   ```

4. Verify the containers are running:

   ```bash
   docker compose ps
   ```

### 2. Initial Setup

1. Access the dashboard at `http://your-server:3000`
2. Log in with the default credentials:
   - **Username:** `admin`
   - **Password:** `umami`
3. **Change the password immediately** after first login (Settings → Profile)
4. Add a new website:
   - Go to Settings → Websites → Add website
   - Enter your site's domain (e.g., `sampaultoms.com`)
   - Note the **Website ID** (a UUID) — you'll need it for the site integration

## Site Integration

The Astro site uses two environment variables to configure Umami tracking:

| Variable                  | Description                           | Example                                   |
| ------------------------- | ------------------------------------- | ----------------------------------------- |
| `PUBLIC_UMAMI_WEBSITE_ID` | UUID from the Umami dashboard         | `a1b2c3d4-e5f6-7890-abcd-ef1234567890`    |
| `PUBLIC_UMAMI_SRC`        | Full URL to the Umami tracking script | `https://analytics.example.com/script.js` |

The `PUBLIC_` prefix is required — Astro only exposes `PUBLIC_*` environment variables to client-side code via `import.meta.env`.

### Local Development

Add the variables to your `.env` file (or leave them blank to disable tracking):

```env
PUBLIC_UMAMI_WEBSITE_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
PUBLIC_UMAMI_SRC=https://analytics.example.com/script.js
```

### Cloudflare Pages Deployment

Set the environment variables in the Cloudflare Pages dashboard:

1. Go to your project → Settings → Environment variables
2. Add `PUBLIC_UMAMI_WEBSITE_ID` and `PUBLIC_UMAMI_SRC` for the **Production** environment
3. Redeploy for the changes to take effect

> **Note:** Cloudflare Pages requires a full redeployment to pick up new or changed environment variables.

## Production Deployment Tips

### Reverse Proxy with HTTPS

Do not expose Umami directly on port 3000. Use a reverse proxy with TLS:

**Option A: Caddy (recommended — automatic HTTPS)**

```
analytics.example.com {
    reverse_proxy localhost:3000
}
```

**Option B: Nginx**

```nginx
server {
    listen 443 ssl http2;
    server_name analytics.example.com;

    ssl_certificate     /etc/letsencrypt/live/analytics.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/analytics.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall Rules

Expose only HTTP (80) and HTTPS (443) to the public. Keep port 3000 and PostgreSQL (5432) internal:

```bash
# UFW example
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 3000/tcp
# Do not open PostgreSQL port
```

### PostgreSQL Backup

Set up a cron job to back up the Umami database daily:

```bash
# Add to crontab (runs daily at 3 AM)
0 3 * * * docker exec umami-db-1 pg_dump -U umami umami | gzip > /opt/umami/backups/umami-$(date +\%Y\%m\%d).sql.gz
```

Retain backups for at least 30 days. Test restore periodically with:

```bash
gunzip -c /opt/umami/backups/umami-YYYYMMDD.sql.gz | docker exec -i umami-db-1 psql -U umami umami
```

## Troubleshooting

### Script Not Loading

- Verify both `PUBLIC_UMAMI_WEBSITE_ID` and `PUBLIC_UMAMI_SRC` are set in your environment
- Check the browser's Network tab — is there a request to the Umami script URL?
- Ensure the `PUBLIC_` prefix is used (Astro ignores env vars without it on the client side)
- Redeploy the site after changing environment variables

### No Data Appearing

- Confirm the Website ID in your `.env` matches the one shown in the Umami dashboard
- Check the browser console for CORS errors — ensure your Umami server allows requests from your site's domain
- Verify the Umami server is running: `docker compose ps` and check the health status
- Check Umami server logs: `docker compose logs umami`

### Database Connection Failures

- Verify `DATABASE_URL` matches the PostgreSQL credentials in the compose file
- Check PostgreSQL is healthy: `docker compose logs db`
- Ensure the `umami-db` volume exists and has write permissions
- Try restarting both services: `docker compose restart`
