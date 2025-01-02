import { io } from "socket.io-client";

const socket = io("ws://localhost:3000");
const connections: MessagePort[] = [];

// @ts-expect-error sharedWorkers are not supported yet by TS
self.onconnect = (e: MessageEvent) => {
  const port = e.ports[0];
  connections.push(port);

  // Listen for messages from the js main thread
  port.onmessage = (event) => {
    const { type, payload } = event.data;

    if (type === "emit") {
      socket.emit(payload.event, ...payload.args);
    } else if (type === "subscribe") {
      const eventName = payload.event;
      socket.on(eventName, (data: unknown) => {
        connections.forEach((connection) =>
          connection.postMessage({ eventName, data })
        );
      });
    } else if (type === "unsubscribe") {
      const eventName = payload.event;
      socket.off(eventName);
    }
  };

  socket.on("disconnect", () => {
    connections.forEach((connection) =>
      connection.postMessage({ eventName: "disconnect" })
    );
  });
};

// Adding a default export so we can import this file
export default null