
import sql from '../models/pgGeneral.js'

export async function logsMiddleware({ request, payload }) {

  const data = {};
  data.version = 1;
  data.payload = payload;
  data.accessData = request?.accessData;

  const type = `Request ${request?.method || ''} ${request?.url?.pathname || ''}`

  return await sql`
    INSERT INTO public."logs" (
      "data",
      "type"
    ) VALUES (
      '${JSON.stringify(data)}',
      '${type}'
    )
  `;
};
