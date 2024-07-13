require("dotenv").config();
const hostList = {
    dev: "http://localhost:3000",
    prod: "https://it-track-client.vercel.app/",
}
const hostname = hostList[process.env.STAGE] || hostList.dev

const getHostname = () => {
    const stage = process.env.STAGE
    const stages = {
        dev: "http://localhost:4000",
        prod: "https://it-track.arinchawut.com"
    }
    return stages[stage] || stages.dev
}

module.exports = {
    hostname,
    getHostname
}