function getThaiDateTime() {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const rawDate = new Date().toLocaleString('th-TH', options)
    let [date, time] = rawDate?.split(" ")
    let [day, month, year] = date?.split("/")
    const formatedDate = `${parseInt(year)-543}-${month}-${day}T${time}.000Z`
    return formatedDate
}
getThaiDateTime()
module.exports = {
    getThaiDateTime
}