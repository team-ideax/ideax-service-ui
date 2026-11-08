# ideaX – Turning Ideas Into Software 🚀

> Official Business Website & JSON-Based Admin Management System for **ideaX**, a premier software development service provider.

![ideaX Banner](./public/images/og-preview.svg)

---

## 1. Project Overview

**ideaX** transforms ideas into practical software solutions through thoughtful planning, modern technologies, and reliable development practices. This repository delivers:
- A responsive, high-performance static public website built with **React**, **Vite**, and **Tailwind CSS**.
- Pure **JSON-based content management** (`projects.json`, `reviews.json`, `services.json`, `settings.json`).
- A secure administrative interface under `/admin` to manage projects, moderate client reviews, customize business settings, and publish updates without touching React code.
- Fully automated CI/CD deployment to **GitHub Pages** via **GitHub Actions**.

---

## 2. Business Information

| Field | Details |
| :--- | :--- |
| **Business Name** | `ideaX` |
| **Tagline** | *Turning Ideas Into Software* |
| **Contact Number** | `+91 9345746981` |
| **Official Email** | `team.ideax@gmail.com` |
| **Project Enquiry Form** | [Google Form](https://forms.gle/8RsBqNQtjr6ToifQ7) |
| **Primary Theme** | Premium Black (`#080808`), Dark Card (`#151515`), and Electric Yellow (`#FFD400`) |
| **Typography** | Poppins (Google Fonts) |

---

## 3. Technology Stack

- **Frontend Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3.4 (with customized brand theme & glow effects)
- **Icons**: Lucide React
- **Routing**: React Router 6 (configured with SPA redirect fallback for GitHub Pages deep links)
- **Data Architecture**: Structured JSON files (`src/data/*.json`) with `localStorage` reactive synchronization
- **Deployment**: GitHub Pages with `.github/workflows/deploy.yml` GitHub Actions workflow
- **Publishing Sync**: Direct GitHub REST API integration for 1-click JSON repository commits from Admin Panel

---

## 4. Website Architecture

### 4.1 Public Routes & Sections
- `/` – High-converting Homepage
  - **Hero Section**: Brand logo, electric yellow highlights, quick metrics, CTAs (*Start Your Project*, *Explore Our Work*).
  - `/#about` – About ideaX, engineering principles, core mission, and interactive technology matrix.
  - `/#services` – 6 core service modules (Web, Mobile, Desktop, APIs & Backend, AI/ML, Custom Software) with feature lists and tech stacks.
  - `/#projects` – Interactive portfolio with real-time category filtering (Web, AI/ML, Full Stack, Java, Developer Tools), live search, case-study modal dialogs, and demo/repo links.
  - `/#reviews` – Customer testimonial carousel/grid displaying only approved client reviews with 5-star ratings and verified project tags.
  - `/#process` – 7-step visual engineering workflow (Enquiry → Requirements → Planning → Development → Testing → Delivery → Support).
  - `/#contact` – Direct mailto, tap-to-call phone link, direct WhatsApp conversation link, and Google Form enquiry integration.
  - `Footer` – Brand links, services directory, copyright, and admin portal gateway.
  - `/404` – Dedicated branded Not Found page with return navigation.

### 4.2 Administrative Routes (`/admin`)
- `/admin` – Secure admin authentication screen (Development default: `admin` / `admin`).
- `/admin/dashboard` – Real-time metrics overview (Total, Published & Draft Projects; Total, Approved & Pending Reviews; quick action cards).
- `/admin/projects` – Complete project CRUD:
  - Add / Edit project modal
  - Unique ID auto-generation (`PRJ001`, `PRJ002`...)
  - Multi-tag technology selector
  - Image URL with live preview and fallback handling
  - One-click Publish / Draft toggle & Featured highlight toggle
  - Live search and category filters
  - Export `projects.json` button
- `/admin/reviews` – Customer review moderation:
  - Add new testimonials
  - Star rating selector (1–5)
  - Approval / Rejection toggle (only approved reviews display on public site)
  - Associate review with project name
  - Export `reviews.json` button
- `/admin/settings` – Global website configuration:
  - Business name, tagline, email, phone, and Google form URL
  - Mission, approach, and stats counters
  - Social media handles (GitHub, LinkedIn, Twitter/X, Instagram)
  - Admin credentials management (change username and password with secure hashing)
  - GitHub Repository Sync configuration (Owner, Repo, Branch, Personal Access Token)
  - Export all data files & factory reset capability

---

## 5. Getting Started (Local Development)

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or `v10+`

### Installation
```bash
# Clone the repository
git clone https://github.com/ideax-dev/ideax.git
cd ideax

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Building for Production
```bash
npm run build
```
The optimized static production assets will be built into the `dist/` folder.

---

## 6. Administrative Credentials & Persistence

### Initial Development Credentials
- **Username**: `admin`
- **Password**: `admin`

> ⚠️ **Security Notice**: Change the default credentials in `/admin/settings` before deploying to a public production URL.

### How Content Persistence Works
Static GitHub Pages deployments are read-only at runtime. In ideaX:
1. **Local State Engine**: Changes made in `/admin` immediately update browser storage so changes are visible instantly during your session.
2. **Export JSON**: You can click **Export JSON** in the Admin panel to download the updated `projects.json`, `reviews.json`, or `settings.json` and replace the files in `src/data/`.
3. **One-Click GitHub Publishing**: Configure your GitHub Personal Access Token (PAT) and repository details in `/admin/settings`. Clicking **Publish to GitHub** will push commits directly to your GitHub repository via the GitHub REST API, automatically triggering GitHub Actions to redeploy the live website!

---

## 7. Automated CI/CD Deployment to GitHub Pages

This project includes `.github/workflows/deploy.yml`:
1. Push your changes to the `main` branch.
2. Under your GitHub repository settings:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Every push to `main` automatically builds Vite and deploys the site to `https://<username>.github.io/<repo>/`.
4. Deep routing (such as refreshing `/admin` directly) is handled seamlessly via `public/404.html` SPA redirect restoration.

---

## 8. License & Ownership

© 2026 ideaX. All rights reserved.
Turning Ideas Into Software.
