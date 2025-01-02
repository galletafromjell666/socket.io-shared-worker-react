import express, { Application } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import { createServer, Server as HTTPSServer } from 'http'

export class Server {
  private httpsServer!: HTTPSServer
  private app!: Application
  private io!: SocketIOServer

  private readonly DEFAULT_PORT = 3000
  connectedSockets: string[]

  constructor() {
    this.initialize()
    this.handleRoutes()
    this.handleSocketConnection()
    this.connectedSockets = []
  }

  private initialize(): void {
    this.app = express()
    this.httpsServer = createServer(this.app)
    this.io = new SocketIOServer(this.httpsServer, {
      cors: {
        origin: '*'
      }
    })
  }

  private handleRoutes(): void {
    this.app.get('/status', (req, res) => {
      res.send({ running: true })
    })
  }

  private handleSocketConnection(): void {
    this.io.on('connection', (socket) => {
      // new socket connected
      this.connectedSockets.push(socket.id)
      console.log(
        `Connected: ${socket.id}\nconnectedSockets:`,
        this.connectedSockets
      )

      socket.on('ping', () => {
        console.log(`Received ping from :${socket.id}, sending pong....`)
        socket.emit('pong', { uuid: crypto.randomUUID() })
      })

      socket.on('disconnect', () => {
        this.connectedSockets = this.connectedSockets.filter(
          (u) => u !== socket.id
        )
        console.log(
          `Disconnected: ${socket.id}\nconnectedSockets`,
          this.connectedSockets
        )
      })
    })
  }

  public listen(callback): void {
    this.httpsServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    )
  }
}
