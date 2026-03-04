# 💊 Nöbetçi Eczane

Türkiye genelinde nöbetçi eczaneleri harita ve liste görünümünde gösteren, konum tabanlı modern web uygulaması.

## ✨ Özellikler

- 🗺️ **Harita Görünümü** — Leaflet tabanlı interaktif harita, eczane pin'leri ve popup bilgileri
- 📍 **Konum Tabanlı** — Kullanıcı konumuna göre en yakın eczaneleri otomatik sıralama
- 🔍 **Şehir & İlçe Filtresi** — 81 il ve tüm ilçelerde arama ve filtreleme
- 📱 **Mobil Uyumlu** — Responsive tasarım, drag edilebilir bottom sheet
- 🌙 **Dark Tema** — Modern koyu renk paleti
- ⚡ **SEO Optimized** — SSG ile 816 statik sayfa (81 il + 731+ ilçe)
- 🔐 **Güvenli API** — Server-side proxy ile API token koruması

## 🛠️ Teknoloji Stack

| Kategori | Teknoloji |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Server State | React Query |
| HTTP | Axios |
| Harita | Leaflet |
| API | Pharmlush API |

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Ana sayfa
│   ├── layout.tsx          # Root layout + metadata
│   ├── v1/[...path]/       # API proxy route
│   ├── [city]/nobetci/     # Şehir sayfaları (SSG)
│   └── [city]/[district]/nobetci/  # İlçe sayfaları (SSG)
├── components/
│   ├── common/             # Providers, LocationPermissionModal
│   ├── layout/             # Header
│   ├── pharmacy/           # HomeView, PharmacyMap, PharmacyCard, PharmacyList
│   └── location/           # CitySelector
├── hooks/                  # usePharmacies, useGeolocation, useCities
├── services/               # API client, pharmacyService
├── store/                  # Zustand store
├── types/                  # TypeScript interfaces
├── data/                   # Şehir/ilçe verileri, koordinatlar
└── utils/                  # distance, slug, reverseGeocode
```

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# Geliştirme sunucusunu başlat
npm run dev
```

## ⚙️ Ortam Değişkenleri

| Değişken | Açıklama |
|---|---|
| `PHARMLUSH_API_TOKEN` | Pharmlush API Bearer token |

## 📦 Build

```bash
npm run build
```

816 statik sayfa üretir (81 il + 731+ ilçe). Tüm sayfalar ISR ile otomatik güncellenir.

## 📄 Lisans

MIT
