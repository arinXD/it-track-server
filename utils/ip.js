const axios = require('axios');

async function getPublicIP() {
    let publicIP = null
    try{
        const response = await axios.get('https://ifconfig.me');
        publicIP = response.data
    }catch(error){
        publicIP = "unknow"
    }
    return publicIP
}

module.exports = getPublicIP