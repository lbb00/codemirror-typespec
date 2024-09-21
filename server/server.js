import { WebSocketServer } from 'ws'
import { launch } from './launch.js'

export const startLanguageServer = (port = 8080, path) => {
  console.log('starting server')
  new WebSocketServer({ port }).on('connection', (webSocket) => {
    console.log('connection')
    const socket = {
      send: (content) =>
        webSocket.send(content, (error) => {
          if (error) throw error
        }),
      onMessage: (callback) => webSocket.on('message', callback),
      onError: (callback) => webSocket.on('error', callback),
      onClose: (callback) => webSocket.on('close', callback),
      dispose: () => webSocket.close(),
    }
    if (webSocket.readyState === webSocket.OPEN) {
      launch(socket, path)
    } else {
      webSocket.on('open', () => launch(socket, path))
    }
  })
}

startLanguageServer(8080, 'node_modules/@typespec/compiler/cmd/tsp-server.js')
