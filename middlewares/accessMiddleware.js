
const AccessControl = require('../controllers/AccessControl.js');

function accessMiddleware({ request, set }) {

  const accessData = AccessControl.v01CheckAccess(request.headers.get('x-access-token'))

  if (accessData) {
    request.accessData = accessData;
  }

  if (!accessData) {
    set.status = 403;
    return 'Access denied';
  }
};

module.exports = {
  accessMiddleware
}
