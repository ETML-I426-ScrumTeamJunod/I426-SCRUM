import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Region from '#models/region'

export default class extends BaseSeeder {
  async run() {
    await Region.createMany([
      { id: 1, label: 'Europe and North America' },
      { id: 2, label: 'Latin America and the Caribbean' },
      { id: 3, label: 'Africa' },
      { id: 4, label: 'Asia and the Pacific' },
      { id: 5, label: 'Arab States' },
    ])
  }
}
