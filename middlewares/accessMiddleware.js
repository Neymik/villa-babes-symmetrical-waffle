
import AccessControl from '../controllers/AccessControl.js';

export function accessMiddleware(request, reply) {

  const accessData = AccessControl.v2CheckAccess(request.headers['x-access-token'])

  console.log('==================================================')
  console.log({accessData})

  if (accessData) {
    request.accessData = accessData;
  }

  if (!accessData) {
    throw new Error('Unauthorized!');
  }
};

