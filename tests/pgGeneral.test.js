

import { expect, test } from "bun:test";
import sql from 'models/pgGeneral.js';


test("pgGeneral", async () => {

  const result = await sql`SELECT 1+1 as result`;
  value = result.rows[0].result;

  expect(value).toBe(2);
  
});
