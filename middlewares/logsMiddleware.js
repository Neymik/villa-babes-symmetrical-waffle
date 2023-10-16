
import sql from '../models/pgGeneral.js'

export async function logsMiddleware({ request, payload }) {

  const data = {};
  data.version = 1;
  data.accessData = request?.accessData || 'xd';
  data.method = request?.method;
  data.pathname = request?.url?.pathname;
  // data.payloadBase64 = Buffer.from(payload).toString('base64');

  console.log(data)

  const type = `Request ${request?.method || ''} ${request?.url?.pathname || ''}`

  let result;

  try {
    const json = JSON.stringify(data);
    result = await sql`
      INSERT INTO public."logs" (
        "data",
        "type"
      ) VALUES (
        '${json}',
        '${type}'
      )
    `;
  } catch (error) {
    console.log({error})
  }
  

  return result;
};
