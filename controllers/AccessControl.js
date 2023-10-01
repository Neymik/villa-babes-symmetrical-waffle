
import config from '../config/index.js';

class AccessControl {
  
  static v01CheckAccess(accessToken) {

    const access = config.v01SecuritySecrets.find((v01SecuritySecret) => {
      if (accessToken === v01SecuritySecret.sellerSecret) {
        return v01SecuritySecret;
      }
    })

    if (access) {
      return access;
    }

    return false;
  }

}

export default AccessControl;
