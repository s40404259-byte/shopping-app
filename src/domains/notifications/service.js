class NotificationService {
  constructor() {
    this.notifications = [];
  }

  send({ userId, channel, template, payload }) {
    const notification = {
      notificationId: `ntf_${this.notifications.length + 1}`,
      userId,
      channel,
      template,
      payload,
      status: 'SENT',
      ts: new Date().toISOString(),
    };
    this.notifications.push(notification);
    return notification;
  }

  list(userId) {
    return this.notifications.filter((item) => item.userId === userId);
  }
}

module.exports = { NotificationService };
