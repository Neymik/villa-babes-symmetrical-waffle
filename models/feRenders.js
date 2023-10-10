
import sql from '../models/pgGeneral.js'

class feRenders {

  static async getAll() {
    return await sql`
      SELECT * FROM public."feRenders" AS feRenders
      WHERE feRenders."active" = true
    `
  }

  static async getById(id) {
    return await sql`
      SELECT * FROM public."feRenders" AS feRenders
      WHERE feRenders."active" = true
      AND feRenders."id" = ${id}
    `
  }

}

export default feRenders
