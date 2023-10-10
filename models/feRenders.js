
import sql from '../models/pgGeneral.js'

class feRenders {

  static async getAll() {
    return await sql`
      SELECT * FROM public."feRenders" AS feRenders
      WHERE feRenders."active" = true
    `
  }

}

export default feRenders
