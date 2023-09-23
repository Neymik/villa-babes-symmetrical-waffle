
import { cors } from '@elysiajs/cors'

const { Elysia } = require('elysia')
const routes = require('./routes')
const config = require('./config')

const app = new Elysia()

app.use(routes)
app.use(cors())

app.listen(config.mainAppPort, () => {
  console.log('Listening on port ' + config.mainAppPort)
});
