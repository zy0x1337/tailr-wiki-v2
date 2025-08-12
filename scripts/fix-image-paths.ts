// scripts/fix-image-paths.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixImagePaths() {
  console.log('🔧 Korrigiere Bildpfade in der Datenbank...')
  
  try {
    // Alle Pets mit Bildern laden
    const pets = await prisma.pet.findMany({
      where: {
        OR: [
          { primaryImage: { not: null } },
          { gallery: { not: null } }
        ]
      }
    })

    console.log(`📊 ${pets.length} Pets mit Bildern gefunden`)

    for (const pet of pets) {
      const updates: any = {}
      
      // Primary Image korrigieren
      if (pet.primaryImage && !pet.primaryImage.startsWith('/') && !pet.primaryImage.startsWith('http')) {
        updates.primaryImage = `/${pet.primaryImage}`
      }
      
      // Gallery korrigieren
      if (pet.gallery) {
        try {
          const gallery = JSON.parse(pet.gallery) as string[]
          const correctedGallery = gallery.map(imagePath => {
            if (!imagePath.startsWith('/') && !imagePath.startsWith('http')) {
              return `/${imagePath}`
            }
            return imagePath
          })
          updates.gallery = JSON.stringify(correctedGallery)
        } catch (error) {
          console.warn(`⚠️ Fehler beim Parsen der Gallery für Pet ${pet.name}:`, error)
        }
      }
      
      // Updates durchführen, falls nötig
      if (Object.keys(updates).length > 0) {
        await prisma.pet.update({
          where: { id: pet.id },
          data: updates
        })
        console.log(`✅ Bildpfade korrigiert für: ${pet.name}`)
      }
    }

    // Kategorien korrigieren
    const categories = await prisma.category.findMany({
      where: { image: { not: null } }
    })

    for (const category of categories) {
      if (category.image && !category.image.startsWith('/') && !category.image.startsWith('http')) {
        await prisma.category.update({
          where: { id: category.id },
          data: { image: `/${category.image}` }
        })
        console.log(`✅ Kategorie-Bild korrigiert für: ${category.name}`)
      }
    }

    // Blog Posts korrigieren
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        OR: [
          { cardImage: { not: null } },
          { heroImage: { not: null } }
        ]
      }
    })

    for (const post of blogPosts) {
      const updates: any = {}
      
      if (post.cardImage && !post.cardImage.startsWith('/') && !post.cardImage.startsWith('http')) {
        updates.cardImage = `/${post.cardImage}`
      }
      
      if (post.heroImage && !post.heroImage.startsWith('/') && !post.heroImage.startsWith('http')) {
        updates.heroImage = `/${post.heroImage}`
      }
      
      if (Object.keys(updates).length > 0) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: updates
        })
        console.log(`✅ Blog-Post-Bilder korrigiert für: ${post.title}`)
      }
    }

    console.log('🎉 Alle Bildpfade erfolgreich korrigiert!')

  } catch (error) {
    console.error('❌ Fehler beim Korrigieren der Bildpfade:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixImagePaths()
