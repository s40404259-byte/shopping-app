class EventBus {
  constructor() {
    this.handlers = new Map();
  }

  subscribe(topic, handler) {
    const handlers = this.handlers.get(topic) || [];
    handlers.push(handler);
    this.handlers.set(topic, handlers);
  }

  publish(event) {
    const handlers = this.handlers.get(event.topic) || [];
    handlers.forEach((handler) => handler(event));
  }
}

module.exports = { EventBus };
