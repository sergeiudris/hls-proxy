import * as fs from 'fs-extra'
import * as path from 'path'
import { logger } from './_logger'

const DATA_URL = path.join(__dirname)

export namespace files {

  export function dataset<T = any>(fileName: string): T {
    return readJson(path.join(DATA_URL, 'db', 'dataset', fileName))
  }

  export function datasets<T = any>(): T {
    return readJson(path.join(DATA_URL, 'public', 'datasets.json'))
  }

  export function readJson(filepath: string) {
    try {
      const file = fs.readFileSync(filepath).toString()
      const json = JSON.parse(file)
      return json
    } catch (err) {
      logger.error(err)
      return undefined
    }
  }
}
