
import sql from '../models/pgGeneral';

// TODO сделать нормально
const dbSellers = await sql`
  SELECT * FROM public."sellers" AS sellers
  WHERE sellers."active" = true
`

class AccessControl {
  
  static v2CheckAccess(accessToken) {

    const access = dbSellers.find((seller) => {
      if (accessToken === seller.pass) {
        return seller;
      }
    })

    if (access) {
      return access;
    }

    return false;
  }

}

export default AccessControl;
