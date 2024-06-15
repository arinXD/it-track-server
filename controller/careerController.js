const fs = require('fs');
const path = require('path');
const models = require('../models');
const Career = models.Career
const { getHostname } = require('../api/hostname');

const getAllCareers = async (req, res) => {
     try {
          const careers = await Career.findAll()
          return res.status(200).json({
               ok: true,
               data: careers
          })
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error"
          })
     }
}

const getCareerByTrack = async (req, res) => {
     const track = req.params.track
     try {
          const careers = await Career.findAll({
               where: { track }
          })
          return res.status(200).json({
               ok: true,
               data: careers
          })
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error"
          })
     }
}

const createCareer = async (req, res) => {
     const careerData = req.body
     const image = `${getHostname()}/images/careers/${careerData.fileName}`
     try {
          const newCareer = await Career.create({
               ...careerData,
               image
          })
          return res.status(200).json({
               ok: true,
               message: "เพิ่มข้อมูลสำเร็จ",
               newCareer
          })
     } catch (error) {
          const filePath = path.join(__dirname, `../public/images/careers/${careerData.fileName}`)
          if (fs.existsSync(filePath)) {
               fs.unlinkSync(filePath)
          }
          return res.status(401).json({
               ok: false,
               message: "เพิ่มข้อมูลไม่สำเร็จ"
          })
     }
}
const updateCareer = async (req, res) => {
     const id = req.params.id
     const careerData = req.body
     const image = careerData.fileName ? `${getHostname()}/images/careers/${careerData.fileName}` : careerData.filePath
     const updateData = {
          ...careerData,
          image
     }
     try {
          const newCareer = await Career.update(updateData, {
               where: { id }
          })
          return res.status(200).json({
               ok: true,
               message: "แก้ไขข้อมูลสำเร็จ",
               newCareer
          })
     } catch (error) {
          console.log(error);
          return res.status(401).json({
               ok: false,
               message: "แก้ไขข้อมูลไม่สำเร็จ"
          })
     }
}
const deleteMultipleCareer = async (req, res) => {
     const careers = req.body.careers
     for (let index = 0; index < careers.length; index++) {
          const careerId = careers[index];
          try {
               const career = await Career.findOne({
                    where: {
                         id: careerId
                    },
               })
               const filePath = path.join(__dirname, `../public/images/careers/${career?.image?.split('/')?.pop()}`);
               if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
               }
               await career.destroy();

          } catch (error) {
               console.log(error);
               return res.status(401).json({
                    ok: false,
                    message: "ลบข้อมูลไม่สำเร็จ"
               })
          }
     }
     return res.status(200).json({
          ok: false,
          message: "ลบข้อมูลสำเร็จ"
     })

}

module.exports = {
     getCareerByTrack,
     getAllCareers,
     createCareer,
     updateCareer,
     deleteMultipleCareer,
}