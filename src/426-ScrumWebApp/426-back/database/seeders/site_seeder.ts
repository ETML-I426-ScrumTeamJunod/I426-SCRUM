import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Site from '#models/site'

export default class extends BaseSeeder {
  async run() {
    const sites = [
      {
        id: 1,
        nom: 'Tubbataha Reefs Natural Park',
        categorie: 'Natural',
        description: '96,828 ha atoll reef known for its high density of marine species...',
        longitude: 119.8675,
        latitude: 8.9533333333,
        lien_image: '',
        region_fk: 4,
        pays: [117],
      },
      // … tous les autres sites
    ]

    for (const site of sites) {
      const newSite = await Site.create({
        id: site.id,
        nom: site.nom,
        categorie: site.categorie,
        description: site.description,
        longitude: site.longitude,
        latitude: site.latitude,
        lien_image: site.lien_image,
        regionId: site.region_fk,
      })

      await newSite.related('pays').attach(site.pays)
    }
  }
}
