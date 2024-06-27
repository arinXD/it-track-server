const { format, createLogger, transports } = require('winston');

const formatter = format((info, opts) => {
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

const options = { timeZone: 'Asia/Bangkok' };
const currentDate = new Date().toLocaleDateString('en-US', options);
const dateParts = currentDate.split('/');
const year = dateParts[2];
const month = dateParts[0].padStart(2, '0');
const day = dateParts[1].padStart(2, '0');
const dateNow = `${year}_${month}_${day}`;

const logger = createLogger({
     level: 'info', // skip logging debug
     format: format.combine(
          formatter(),
          format.json()
     ),
     transports: [
          new transports.File({ filename: `logging/${dateNow}.log` })
     ],
});
module.exports = logger

