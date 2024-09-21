import { WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc'
import { createConnection, createServerProcess, forward } from 'vscode-ws-jsonrpc/server'
import { Message, InitializeRequest } from 'vscode-languageserver'

const isInitializeRequest = (message) => message.method === InitializeRequest.type.method

export const launch = (socket, path) => {
  const reader = new WebSocketMessageReader(socket)
  const writer = new WebSocketMessageWriter(socket)

  const socketConnection = createConnection(reader, writer, () => socket.dispose())
  const serverConnection = createServerProcess('Typespec', 'node', [path, '--stdio'])
  forward(socketConnection, serverConnection, (message) => {
    if (Message.isRequest(message) && isInitializeRequest(message)) {
      message.params.processId = process.pid
    }
    return message
  })
}
