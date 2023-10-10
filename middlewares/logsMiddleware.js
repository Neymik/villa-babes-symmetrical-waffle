
import sql from '../models/pgGeneral.js'

export function logsMiddleware({ request, payload }) {

  const data = JSON.stringify(payload)
  const type = request.method + ' ' + request.url.pathname

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
