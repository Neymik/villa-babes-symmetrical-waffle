
import AccessControl from '../controllers/AccessControl.js';

export function accessMiddleware(request, replyRaw, next) {

  const accessData = AccessControl.v01CheckAccess(request.headers['x-access-token'])

  if (accessData) {
    request.accessData = accessData;
  }

  if (!accessData) {
    replyRaw.statusCode = 403;
    return replyRaw.end();
  }

  return next();
};

