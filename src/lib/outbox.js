class Outbox {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.queue = [];
  }

  enqueue(topic, payload) {
    this.queue.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      topic,
      payload,
      createdAt: new Date().toISOString(),
    });
  }

  flush() {
    while (this.queue.length > 0) {
      this.eventBus.publish(this.queue.shift());
    }
  }
}

module.exports = { Outbox };
