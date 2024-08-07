const { format } = require('date-fns')

const months = {
     "01": 'มกราคม',
     "02": 'กุมภาพันธ์',
     '03': 'มีนาคม',
     "04": 'เมษายน',
     "05": 'พฤษภาคม',
     "06": 'มิถุนายน',
     "07": 'กรกฎาคม',
     '08': 'สิงหาคม',
     "09": 'กันยายน',
     "10": 'ตุลาคม',
     "11": 'พฤศจิกายน',
     "12": 'ธันวาคม',
}
const monthsY = {
     "01": 'ม.ค.',
     "02": 'ก.พ.',
     '03': 'มี.ค.',
     "04": 'เม.ย.',
     "05": 'พ.ค.',
     "06": 'มิ.ย.',
     "07": 'ก.ค.',
     '08': 'ส.ค.',
     "09": 'ก.ย.',
     "10": 'ต.ค.',
     "11": 'พ.ย.',
     "12": 'ธ.ค.',
}

function getDateProperty(date) {
     const parsedDate = new Date(date);

     const day = format(parsedDate, 'dd');
     const month = format(parsedDate, 'MM');
     const thaiMonth = months[month];
     const thaiMonthY = monthsY[month];
     const defYear = parsedDate.getFullYear()
     const year = parsedDate.getFullYear() + 543;
     const hours = format(parsedDate, 'HH');
     const minutes = format(parsedDate, 'mm');

     return {
          day,
          month,
          thaiMonth,
          thaiMonthY,
          defYear,
          year,
          hours,
          minutes,
     }
}

function simpleDMYHM(date) {
     const { day, thaiMonth, year, hours, minutes } = getDateProperty(date)
     return `${day} ${thaiMonth} ${year} ${hours}:${minutes} น.`;
}
function simpleDMY(date) {
     const { day, thaiMonth, year } = getDateProperty(date)
     return `${day} ${thaiMonth} ${year}`;
}
function simpleDM(date) {
     const { day, thaiMonth } = getDateProperty(date)
     return `${day} ${thaiMonth}`;
}
function simpleDmyhm(date) {
     const { day, thaiMonthY, defYear, hours, minutes } = getDateProperty(date)
     return `${day} ${thaiMonthY} ${defYear} ${hours}:${minutes}`;
}

module.exports = {
     simpleDMYHM,
     simpleDMY,
     simpleDM,
     simpleDmyhm,
}