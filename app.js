
import { staticPlugin } from '@elysiajs/static'
import { cors } from '@elysiajs/cors'

const { Elysia } = require('elysia')
const routes = require('./routes')
const config = require('./config')

const app = new Elysia()

app.use(routes)
app.use(staticPlugin())
app.use(cors())

app.listen(config.mainAppPort, () => {
  console.log('Listening on port 3000')
});
