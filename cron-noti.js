const cron = require('node-cron');
const models = require('./models');
const Notification = models.Notification

const NOTI_SCHEDULE = '0 3 * * *'

cron.schedule(NOTI_SCHEDULE, async () => {
     await Notification.destroy({
          where: {
               isRead: true
          }
     })
});