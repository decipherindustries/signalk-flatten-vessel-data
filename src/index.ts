/**
  Copyright 2019, Fabian Tollenaar <fabian@decipher.industries> (https://decipher.industries)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License
**/

import Debug, { Debugger } from 'debug'

function isLeaf (mixed:any):boolean {
  if (mixed && typeof mixed === 'object' && mixed.hasOwnProperty('value')) {
    return true
  }

  return false
}

function flatten (tree:any, prefix:string = '') {
  const keys:string[] = Object.keys(tree)
  const output:any = {}

  keys.forEach((key:string) => {
    const value:any = tree[key]

    if (prefix !== '') {
      key = `${prefix}.${key}`
    }

    if (value && typeof value === 'object' && !isLeaf(value)) {
      const child:any = flatten(value)
      const childKeys:string[] = Object.keys(child)

      childKeys.forEach((subkey:string) => {
        output[`${key}.${subkey}`] = child[subkey]
      })
    } else {
      output[key] = value
    }
  })

  return output
}

export default function (app:any) {
  const _debug:Debugger = Debug('flatten-vessel-data')
  const error = app.error || ((msg:string) => _debug(msg))
  const debug = app.debug || ((msg:string) => _debug(msg))

  const plugin: Plugin = {
    start (props: any):void {
      if (!app.getSelfPath) {
        error("Please upgrade the server, aisreporter needs app.getSelfPath and will not start")
        return
      }

      app.get('/signalk/v1/flat/self/keys', (req:any, res:any) => {
        const tree:any = app.signalk.self
        res.json(Object.keys(flatten(tree)))
      })

      app.get('/signalk/v1/flat/root/keys', (req:any, res:any) => {
        const tree:any = app.signalk.root
        res.json(Object.keys(flatten(tree)))
      })

      app.get('/signalk/v1/flat/self', (req:any, res:any) => {
        const tree:any = app.signalk.self
        res.json(flatten(tree))
      })

      app.get('/signalk/v1/flat/root', (req:any, res:any) => {
        const tree:any = app.signalk.root
        res.json(flatten(tree))
      })
    },

    stop ():void {
      
    },

    statusMessage ():string {
      return `Ready`
    },

    started: true,
    id: 'flatten-vessel-data',
    name: 'flatten-vessel-data',
    description: 'Signal K Node.js server plugin that make all rest data available as a flat list of keys',
    schema: {
      type: 'object',
      properties: {}
    }
  }

  return plugin
}

interface Plugin {
  start: (app: any) => void,
  stop: () => void,
  statusMessage: (msg: string) => void,
  started: boolean,
  id: string,
  name: string,
  description: string,
  schema: any
}
