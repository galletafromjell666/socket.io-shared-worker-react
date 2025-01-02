import socketIOSharedWorker from "../sharedWorker?sharedworker";

class SocketWorkerWrapper {
  worker: null | SharedWorker;
  ready: boolean;
  listeners: Map<string, Array<(data: unknown) => void>>;
  constructor() {
    this.worker = null;
    this.ready = false;
    this.listeners = new Map();
    this.initWorker();
  }

  initWorker() {
    this.worker = new socketIOSharedWorker();
    // start communication with worker
    this.worker.port.start();

    // Listen for messages from the worker
    this.worker.port.onmessage = (event) => {
      const { eventName, data } = event.data;
      if (this.listeners.has(eventName)) {
        this.listeners.get(eventName)?.forEach((callback) => callback(data));
      }
    };

    this.ready = true;
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.ready) return;
    this.worker!.port.postMessage({ type: "emit", payload: { event, args } });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
    this.worker!.port.postMessage({ type: "subscribe", payload: { event } });
  }

  off(event: string, callback: unknown) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const filtered =
        callbacks?.filter((cb: unknown) => cb !== callback) ?? [];
      this.listeners.set(event, filtered);

      // If no listeners remain, unsubscribe
      if (filtered.length === 0) {
        this.worker!.port.postMessage({
          type: "unsubscribe",
          payload: { event },
        });
      }
    }
  }
}

const socketWorkerInstance = new SocketWorkerWrapper();

export default socketWorkerInstance;
