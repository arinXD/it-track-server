const { format, createLogger, transports } = require('winston');

const formatter = format((info, opts) => {
     if (info.meta && info.meta.req) {
          info.ip = info.meta.req.clientIp;
     } else {
          info.ip = 'unknown';
     }

     const bangkokTimezone = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Bangkok',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
     });

     info.timestamp = bangkokTimezone.format(new Date());
     return info;
});

const logger = createLogger({
     level: 'info', // skip logging debug
     format: format.combine(
          formatter(),
          format.json()
     ),
     transports: [
          new transports.File({ filename: 'logging.log' })
     ],
});
module.exports = logger

