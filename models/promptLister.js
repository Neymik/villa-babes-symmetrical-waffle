
import promptConstructorDefaults from '../models/promptConstructorDefaults.js' 

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
    return undefined // TODO get here from db
  }

}

export default promptConstructorModel
