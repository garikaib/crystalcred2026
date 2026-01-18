# Crystal Cred

A modern web application for financial services, featuring an administrative dashboard, blog, and product management.

## Features

- **Admin Dashboard**: Comprehensive management of categories, redirects, and content.
- **Authentication**: Secure login and session management (Magic Links & Password-based).
- **Blog System**: Full-featured blog with Rich Text Editor (TipTap).
- **SEO Optimized**: Dynamic metadata, sitemap generation, and clean URL structures.
- **Service & Product Catalog**: Showcasing financial products and services.
- **Deployment Scripts**: Automated SSL setup, Nginx configuration, and Snyk security scanning.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: Tailwind CSS
- **Database**: MongoDB (via Mongoose)
- **Security**: Snyk, Turnstile integration
- **Editor**: TipTap

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Shared utilities and database configurations.
- `models/`: Mongoose schemas for data management.
- `scripts/`: Operational scripts for deployment and maintenance.
- `resources/`: Configuration templates (Nginx, etc.).

## Deployment

The project includes several utility scripts for deployment in the `scripts/` directory:
- `deploy.sh`: Primary deployment sequence.
- `get-ssl.sh`: Certbot SSL certificate management.
- `security-scan.sh`: Local security auditing.

