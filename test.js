const { findSubjectByCode } = require("./utils/subject")

const init = async()=>{
    const id = await findSubjectByCode("SC361002")
    console.log("id: "+ id);
}

init()