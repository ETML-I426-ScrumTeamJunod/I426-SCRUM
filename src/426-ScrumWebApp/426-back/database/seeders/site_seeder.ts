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

    offset += limit
  }

  return all
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

      const site = await Site.firstOrCreate(
        {
          latitude: item.coordinates.lat,
          longitude: item.coordinates.lon,
        },
        {
          categorie: item.category,
          regionId: region.id,
          lienImage: item.main_image_url,
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
          imageAlt: item.main_caption_en,
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
          imageAlt: item.main_caption_fr || item.main_caption_en,
        }
      )
    }
  }
}
