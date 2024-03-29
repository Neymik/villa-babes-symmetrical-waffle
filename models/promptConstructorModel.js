
import promptConstructorDefaults from '../models/promptConstructorDefaults.js'
import sql from '../models/pgGeneral.js'

class promptConstructorModel {

  constructor(context = {}) {
    for (const key in context) {
      this[key] = context[key]
    }
  }
  
  async get(key) {

    if (this[key]) {
      return this[key]
    }

    const promptDB = await this.getPromptDB(key)
    if (promptDB) {
      return promptDB
    }
  
    if (promptConstructorDefaults[key]) {
      return promptConstructorDefaults[key]
    }
  
    return ''
  
  }

  addContext(key, value) {
    this[key] = value
  }
  
  
  async getPromptDB(key, context = {}) {

    const value = await sql`
      SELECT * FROM public."promptsBase" AS promptsBase
      WHERE promptsBase."active" = true
      AND promptsBase."key" = ${key}
    `;

    if (value.length) {
      return value[0].value
    }

    return undefined
  }

}

export default promptConstructorModel
