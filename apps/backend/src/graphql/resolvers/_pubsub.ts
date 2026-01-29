import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();

export const pubsub = {
  asyncIterator: (triggers: string[]) => {
    const event = triggers[0];
    const queue: any[] = [];
    let listening = true;
    const pushValue = (value: any) => {
      if (listening) queue.push({ value, done: false });
    };
    emitter.on(event, pushValue);
    const asyncIterator = {
      async next() {
        while (queue.length === 0 && listening) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        if (!listening) {
          return { value: undefined, done: true };
        }
        return queue.shift() || { value: undefined, done: true };
      },
      async return() {
        listening = false;
        emitter.off(event, pushValue);
        return { value: undefined, done: true };
      },
      async throw(error: any) {
        listening = false;
        emitter.off(event, pushValue);
        throw error;
      },
      [Symbol.asyncIterator]() { return this; }
    };
    return asyncIterator;
  },
  publish: (event: string, payload: any) => {
    emitter.emit(event, payload);
    return Promise.resolve(true);
  }
};
