# 💊 Nöbetçi Eczane

A modern, location-based web application that displays on-duty pharmacies across Turkey with interactive map and list views.

## ✨ Features

- 🗺️ **Interactive Map** — Leaflet-powered map with pharmacy pins and info popups
- 📍 **Location-Based** — Automatically sorts pharmacies by proximity to user
- 🔍 **City & District Filter** — Search and filter across all 81 provinces and districts
- 📱 **Mobile Responsive** — Adaptive layout with draggable bottom sheet
- 🌙 **Dark Theme** — Modern dark color palette
- ⚡ **SEO Optimized** — 816 statically generated pages via SSG (81 cities + 731+ districts)
- 🔐 **Secure API** — Server-side proxy keeps API tokens hidden from the client

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Server State | React Query |
| HTTP | Axios |
| Maps | Leaflet |
| API | Pharmlush API |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home page
│   ├── layout.tsx          # Root layout + metadata
│   ├── v1/[...path]/       # API proxy route
│   ├── [city]/nobetci/     # City pages (SSG)
│   └── [city]/[district]/nobetci/  # District pages (SSG)
├── components/
│   ├── common/             # Providers, LocationPermissionModal
│   ├── layout/             # Header
│   ├── pharmacy/           # HomeView, PharmacyMap, PharmacyCard, PharmacyList
│   └── location/           # CitySelector
├── hooks/                  # usePharmacies, useGeolocation, useCities
├── services/               # API client, pharmacyService
├── store/                  # Zustand store
├── types/                  # TypeScript interfaces
├── data/                   # City/district data, coordinates
└── utils/                  # distance, slug, reverseGeocode
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

## ⚙️ Environment Variables

| Variable | Description |
|---|---|
| `PHARMLUSH_API_TOKEN` | Pharmlush API Bearer token |

## 📦 Build

```bash
npm run build
```

Generates 816 static pages (81 cities + 731+ districts). All pages are automatically updated via ISR.

## 📄 License

MIT
