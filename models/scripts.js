
import sql from '../models/pgGeneral.js'

class feRenders {

  static async getByCategory(category) {
    return await sql`
      SELECT * FROM public."scriptsBase" AS scriptsBase
      WHERE scriptsBase."active" = true
      AND scriptsBase."category" = ${category}
    `
    // ORDER BY RANDOM()
    // LIMIT 3
  }

  static async getAll() {
    return await sql`
      SELECT * FROM public."scriptsBase" AS scriptsBase
      WHERE scriptsBase."active" = true
    `
  }

}

export default feRenders
