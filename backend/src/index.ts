import { Server } from './server'
import { logger } from './utils/logger'

const server = new Server()

server.listen((port) => {
  logger.green(`Server is listening on ${port}`)
})
