
import sql from './pgGeneral.js'

class ofMembers {

  static async get(creatorId) {

    return await sql`
      SELECT * FROM public."creators" WHERE "id" = ${ creatorId };
    `

  }

}

export default ofMembers
