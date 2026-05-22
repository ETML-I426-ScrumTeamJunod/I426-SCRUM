import sharp from 'sharp'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Site from '#models/site'
import Region from '#models/region'
import SiteTraduction from '#models/site_traduction'
import Pays from '#models/pays'
import AppartenirA from '#models/appartenir_a'

async function fetchAllRecords() {
  const all = []
  let offset = 0
  const limit = 100

  while (true) {
    const response = await fetch(
      `https://data.unesco.org/api/explore/v2.1/catalog/datasets/whc001/records?limit=${limit}&offset=${offset}`
    )

    const data = (await response.json()) as any

    if (!data.results || data.results.length === 0) break

    all.push(...data.results)

    break;
    
    offset += limit

  }
  
  return all
}

async function fetchImageAsBuffer(url: string): Promise<{ buffer: Buffer; ext: string } | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const arrayBuffer = await response.arrayBuffer()
    const originalBuffer = Buffer.from(arrayBuffer)

    // Compress the image
    const compressedBuffer = await sharp(originalBuffer)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer()

    // If the compressed image is still too large, skip it
    if (compressedBuffer.length > 5 * 1024 * 1024) {
      console.warn('Image too large, skipping')
      return null
    }
    return {
      buffer: compressedBuffer,
      ext: 'jpeg',
    }
  } catch (err) {
    console.error('Image processing failed:', err)
    return null
  }
}

export default class extends BaseSeeder {
  async run() {
    const results = (await fetchAllRecords()) as any

    for (const item of results) {
      if (!item.states_names) continue
      if (!item.coordinates?.lat || !item.coordinates?.lon || !item.category) continue

      let region = await Region.findBy('label', item.region)

      if (!region) {
        region = await Region.create({
          label: item.region_en,
        })
      }

      let imageData = null

      if (item.main_image_url) {
        imageData = await fetchImageAsBuffer(item.main_image_url)
      }

      const site = await Site.firstOrCreate(
        {
          latitude: item.coordinates.lat,
          longitude: item.coordinates.lon,
        },
        {
          categorie: item.category,
          regionId: region.id,
          imageBlob: imageData?.buffer || null,
          imageExtension: imageData?.ext || null,
        }
      )

      const nameEn = item.name_en || 'Unknown'
      const descEn = item.short_description_en || 'No description'

      await SiteTraduction.firstOrCreate(
        {
          codeLangue: 'en',
          siteId: site.id,
        },
        {
          nom: nameEn,
          description: descEn,
          imageAlt: item.main_image_caption_en,
        }
      )

      for (const countryName of item.states_names) {
        const cleanName = countryName.split('(')[0].trim()

        const pays = await Pays.firstOrCreate({ nom: cleanName }, { nom: cleanName })

        await AppartenirA.firstOrCreate(
          {
            siteId: site.id,
            paysId: pays.id,
          },
          {
            siteId: site.id,
            paysId: pays.id,
          }
        )
      }

      const nameFr = item.name_fr?.trim() || nameEn
      const descFr = item.short_description_fr?.trim() || descEn

      await SiteTraduction.firstOrCreate(
        {
          codeLangue: 'fr',
          siteId: site.id,
        },
        {
          nom: nameFr,
          description: descFr,
          imageAlt: item.main_image_caption_fr || item.main_image_caption_en,
        }
      )
    }
  }
}
