require("dotenv").config();
let hostname = "http://localhost:3000"
hostname = "https://it-track-client.vercel.app/"

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