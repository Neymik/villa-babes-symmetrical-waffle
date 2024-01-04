
import sql from './pgGeneral.js'

class ofMembers {

  static async upsert(ofid, creatorId, totalEarnings = 0) {

    const member = await sql`
      INSERT INTO public."allMembers" ("ofid")
        VALUES (${ ofid })
      ON CONFLICT ON CONSTRAINT allmembers_un 
        DO UPDATE SET "updatedAt" = NOW()
      RETURNING id;
    `

    const creatorMember = await sql`
      INSERT INTO public."creatorsMembers" ("creatorId", "memberId", "totalEarnings", "updatedAt")
        VALUES (${ creatorId }, ${ member[0].id }, ${ totalEarnings }, NOW())
      ON CONFLICT ON CONSTRAINT creatorsmembers_pk 
        DO UPDATE SET "totalEarnings" = ${ totalEarnings }, "updatedAt" = NOW()
    `

    return 
  }

  static async count() {
    return await sql`
      SELECT COUNT(*) FROM public."allMembers";
    `
  }

}

export default ofMembers
