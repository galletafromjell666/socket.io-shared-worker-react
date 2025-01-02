# socket.io-shared-worker-react

This example project demonstrates how to wrap a Socket.IO client in a shared worker using a singleton pattern to ensure only one client connection per browser.

This approach is more efficient than maintaining a separate connection for each user tab, as the number of tabs can grow rapidly, increasing the cost of running a Socket.IO server.

## The Idea

The solution involves creating a wrapper singleton that provides the most commonly used methods from a Socket.IO instance (`emit`, `on`, and `off`) . This class (`SocketIOWrapper`) communicates with the shared worker using a MessagePort. The shared worker, in turn, manages the listeners and handlers for the three previously mentioned methods.

## How to run

The repository includes a simple socket.IO server that replies "pong" once a "ping" event is received.

Clone the repository

```shell
git clone https://github.com/galletafromjell666/socket.io-shared-worker-react.git
```

Move inside it

```shell
cd 'socket.io-shared-worker-react'
```

Move inside the backend subfolder and install the dependencies

```shell
cd backend && npm install
```

Run the backend in dev mode

```shell
npm run start:watch
```

Open a new window shell window and install the dependencies for the frontend

```shell
npm install
```

Run the frontend in dev mode

```shell
npm run dev
```
