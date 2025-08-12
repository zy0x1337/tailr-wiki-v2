// scripts/migrate.mjs
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()

// JSON Dateien laden
const petsData = JSON.parse(readFileSync(join(__dirname, '../data/petsData.json'), 'utf-8'))
const blogData = JSON.parse(readFileSync(join(__dirname, '../data/blogData.json'), 'utf-8'))

function hasNameProperty(obj) {
  return obj && typeof obj === 'object' && 'name' in obj && typeof obj.name === 'string'
}

async function migrateData() {
  console.log('🚀 Starte Daten-Migration von JSON...')

  try {
    // Kategorien importieren
    console.log('📁 Importiere Kategorien...')
    for (const category of petsData.categories) {
      await prisma.category.upsert({
        where: { id: category.id },
        update: {
          name: category.name,
          speciesCount: category.speciesCount,
          image: category.image,
          description: category.description,
        },
        create: {
          id: category.id,
          name: category.name,
          speciesCount: category.speciesCount,
          image: category.image,
          description: category.description,
        }
      })
    }

    // Hunde importieren
    console.log('🐕 Importiere Hunde-Daten...')
    if (petsData.species.dogs?.subcategories) {
      await importSpeciesData(petsData.species.dogs.subcategories, 'dogs')
    }

    // Katzen importieren
    console.log('🐱 Importiere Katzen-Daten...')
    if (petsData.species.cats?.subcategories) {
      await importSpeciesData(petsData.species.cats.subcategories, 'cats')
    }

    // Blog Posts importieren
    console.log('📝 Importiere Blog-Posts...')
    for (const post of blogData) {
      const slug = post.title.toLowerCase()
        .replace(/[äöüß]/g, (match) => {
          const replacements = {'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss'}
          return replacements[match] || match
        })
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      await prisma.blogPost.upsert({
        where: { slug },
        update: {},
        create: {
          title: post.title,
          slug,
          category: post.category,
          content: post.content,
          excerpt: post.excerpt,
          author: JSON.stringify(post.author),
          readingTime: post.readingTime,
          cardImage: post.cardImage,
          heroImage: post.heroImage,
          publishedAt: new Date(post.date)
        }
      })
    }

    console.log('✅ Migration erfolgreich abgeschlossen!')

    // Statistiken
    const petCount = await prisma.pet.count()
    const categoryCount = await prisma.category.count()
    const blogCount = await prisma.blogPost.count()
    
    console.log(`📊 Ergebnis:`)
    console.log(` - ${categoryCount} Kategorien`)
    console.log(` - ${petCount} Pets`)
    console.log(` - ${blogCount} Blog Posts`)

    // Species-spezifische Counts
    const dogCount = await prisma.pet.count({ where: { species: 'dogs' } })
    const catCount = await prisma.pet.count({ where: { species: 'cats' } })

    console.log(`🐕 Hunde: ${dogCount}`)
    console.log(`🐱 Katzen: ${catCount}`)

  } catch (error) {
    console.error('❌ Migration-Fehler:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function importSpeciesData(subcategories, speciesName) {
  for (const [subcategoryKey, subcategory] of Object.entries(subcategories)) {
    if (!hasNameProperty(subcategory)) {
      console.warn(`⚠️ Überspringe Subcategory ${subcategoryKey} - keine 'name' Property`)
      continue
    }

    console.log(`📂 Verarbeite ${speciesName} Subcategory: ${subcategory.name}`)
    
    for (const pet of subcategory.species) {
      const slug = pet.name.toLowerCase()
        .replace(/[äöüß]/g, (match) => {
          const replacements = {'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss'}
          return replacements[match] || match
        })
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      await prisma.pet.upsert({
        where: { slug },
        update: {},
        create: {
          name: pet.name,
          slug,
          breed: pet.name,
          species: speciesName,
          subcategory: subcategory.name,
          description: pet.description,
          origin: pet.origin,
          size: pet.size,
          weight: pet.weight,
          lifeExpectancy: pet.lifeExpectancy,
          careLevel: pet.careLevel,
          primaryImage: pet.image,
          gallery: pet.gallery ? JSON.stringify(pet.gallery) : null,
          temperament: pet.temperament ? JSON.stringify(pet.temperament) : null,
          summary: pet.details?.summary,
          character: pet.details?.character,
          health: pet.details?.health,
          grooming: pet.details?.grooming,
          activity: pet.details?.activity,
          suitability: pet.details?.suitability,
          ratings: pet.ratings ? JSON.stringify(pet.ratings) : null,
        }
      })
    }
  }
}

migrateData()
