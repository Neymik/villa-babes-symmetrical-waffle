
import sql from '../models/pgGeneral.js'

export function logsMiddleware({ request, payload }) {

  const data = {};
  data.version = 1;
  data.payload = payload;
  data.accessData = request?.accessData;

  const type = `Request ${request?.method || ''} ${request?.url?.pathname || ''}`

  return sql`
    INSERT INTO public."logs" (
      "data",
      "type"
    ) VALUES (
      "${data}",
      "${type}"
    )
  `;
};
