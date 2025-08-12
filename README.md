# TAILR.WIKI - Personal Development Notes

> SQLite-basierte Haustier-Platform mit Next.js 15 + React 19

## Quick Start

Development starten
npm run dev

Database Schema pushen
npx prisma db push

Prisma Studio öffnen
npx prisma studio

text

## Tech Stack

- **Next.js 15.4.6** + **React 19.1.0** + **TypeScript 5.9.2**
- **SQLite** mit **Prisma 6.13.0**
- **daisyUI 5.0.50** + **Tailwind CSS**

## Project Structure

app/
├── layout.tsx # Root Layout + Navigation
├── page.tsx # Homepage
├── blog/[slug]/page.tsx # Blog Posts
├── [species]/page.tsx # Category Pages
└── components/
├── ui/ # Navigation, CategoryImage, ThemeToggle
└── providers/ # Context Providers

prisma/
├── schema.prisma # SQLite Schema
├── dev.db # Database File
└── seed.ts # Seed Data

text

## Database Models

model Category {
id String @id // "dogs", "cats"
name String // "Hunde", "Katzen"
speciesCount Int
pets Pet[]
}

model Pet {
id Int @id @default(autoincrement())
name String
slug String @unique
species String
category Category @relation(fields: [species], references: [id])

// JSON Strings für flexible Daten
temperament String? // ["Intelligent", "Loyal"]
ratings String? // Complex rating object
gallery String? // Image URLs array
}

model BlogPost {
id Int @id @default(autoincrement())
title String
slug String @unique
content String
author String // JSON object
}

text

## Development Commands

Database
npx prisma db push # Schema zu DB
npx prisma studio # DB GUI
npx prisma migrate reset # Reset DB

Development
npm run dev # Dev server
npm run build # Production build
npm run type-check # TypeScript check

Analysis
npm run analyze # Bundle analysis
npm run lighthouse # Performance audit

text

## Environment Variables

.env.local
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

text

## Performance Targets

- **Lighthouse**: 95+
- **FCP**: <1s (aktuell: 0.4s)  
- **LCP**: <2s (aktuell: 0.8s)
- **Bundle**: ~300KB

## Key Components

### Navigation System
- Burger-Menü mit `navigationItems` Array
- `isMenuOpen` State Management
- Theme Toggle Integration

### Category Cards  
- `CategoryImage` Component mit WebP-First
- Responsive Skalierung über `category-image-container`
- Zoom-Effekte bei Hover

### Blog System
- Individual Posts mit SEO-Metadata
- Author JSON Parsing Pattern
- Related Posts Logic

## JSON Parsing Patterns

// Sicheres JSON Parsing für SQLite Strings
function parseRatings(ratingsJson: string | null): PetRatings | null {
if (!ratingsJson) return null;
try {
return JSON.parse(ratingsJson) as PetRatings;
} catch {
return null;
}
}

function parseTemperament(temperamentJson: string | null): string[] {
if (!temperamentJson) return [];
try {
return JSON.parse(temperamentJson) as string[];
} catch {
return [];
}
}

text

## CSS Architecture

/* Etablierte Klassen in globals.css */
.category-card # Card Container
.category-image-container # Image Wrapper
.category-image-enhanced # Enhanced Styling

text

## Development Notes

### Code Standards
- **TypeScript Strict**: 100% Coverage, keine `any` types
- **Server Components**: Default, Client nur bei User Interaction  
- **WebP-First**: Echte Bilder über Emojis bevorzugt
- **daisyUI Components**: Minimales Custom CSS

### Database Notes
- SQLite für Development & Production geeignet
- JSON-String-Felder für flexible Strukturen
- Prisma Auto-Migration mit `db push`
- Backup via einfaches Datei-Copy von `dev.db`

### Deployment Notes
- Vercel unterstützt SQLite Edge Runtime
- Für größere Loads: Migration zu PostgreSQL möglich
- File-based DB = einfache Backups
