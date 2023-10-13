
import sql from '../models/pgGeneral.js'

export async function logsMiddleware({ request, payload }) {

  const data = {};
  data.version = 1;
  data.accessData = request?.accessData || '?';
  data.method = request?.method;
  data.pathname = request?.url?.pathname;
  data.payloadBase64 = Buffer.from(payload).toString('base64');

  const type = `Request ${request?.method || ''} ${request?.url?.pathname || ''}`

  console.log ({data:JSON.stringify(data), type})

  let result;
  try {
    result = await sql`
      INSERT INTO public."logs" (
        "data",
        "type"
      ) VALUES (
        '${JSON.stringify(data)}',
        '${type}'
      )
    `;
  } catch (error) {
    console.log({error})
  }
  

  return result;
};
