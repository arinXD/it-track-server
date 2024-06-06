const { Op } = require('sequelize');
const models = require('../models');
const Track = models.Track
const path = require('path');
const fs = require('fs');

const getAllTrack = async (req, res) => {
     try {
          const data = await Track.findAll()
          return res.status(200).json({
               ok: true,
               data
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getTrack = async (req, res) => {
     const track = req.params.track
     try {
          const data = await Track.findOne({
               where: {
                    track
               }
          })
          return res.status(200).json({
               ok: true,
               data
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const updateTrack = async (req, res) => {
     const track = req.params.track
     const updateData = req.body
     try {
          const data = await Track.update(
               updateData, {
               where: {
                    track
               }
          },
          );
          return res.status(200).json({
               ok: true,
               data
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const multipleRestoreTrack = async (req, res) => {
     const tracks = req.body
     try {
          for (let index = 0; index < tracks.length; index++) {
               const track = tracks[index];
               await Track.restore(
                    { where: { track } },
               );
          }
          return res.status(200).json({
               ok: true,
               message: "กู้คืนแทร็กสำเร็จ"
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const insertTrack = async (req, res) => {
     const data = req.body
     try {
          const insertData = Object.keys(data).reduce((result, key) => {
               if (data[key] != null) {
                    result[key] = data[key];
               }
               return result;
          }, {});

          await Track.create(insertData)
          return res.status(200).json({
               ok: true,
               message: "เพิ่มแทร็กสำเร็จ"
          })
     } catch (error) {
          let message = "Server error."
          if (error?.errors[0]?.type == "unique violation") message = "แทร็กนี้ถูกเพิ่มไปแล้ว"
          return res.status(500).json({
               ok: false,
               message
          })
     }
}

const removeTracks = async (req, res) => {
     const tracks = req.body
     try {
          for (let index = 0; index < tracks.length; index++) {
               const track = tracks[index];
               await Track.destroy({
                    where: {
                         track
                    }
               })
          }
          return res.status(200).json({
               ok: true,
               message: "ลบข้อมูลแทร็กสำเร็จ"
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const forceRemoveTracks = async (req, res) => {
     const tracks = req.body
     try {
          for (let index = 0; index < tracks.length; index++) {
               const track = tracks[index];
               await Track.destroy({
                    where: {
                         track
                    },
                    force: true
               })
               let filePath = path.join(__dirname, `../public/images/tracks/coverImg/coverImg_${track?.toLowerCase()}.png`)
               if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
               }
               filePath = path.join(__dirname, `../public/images/tracks/img/img_${track?.toLowerCase()}.png`)
               if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
               }
          }
          return res.status(200).json({
               ok: true,
               message: "ลบข้อมูลแทร็กสำเร็จ"
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getDeletedTracks = async (req, res) => {
     try {
          const data = await Track.findAll({
               paranoid: false,
               where: {
                    daletedAt: {
                         [Op.not]: null
                    }
               },
          })
          return res.status(200).json({
               ok: true,
               data
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

module.exports = {
     getAllTrack,
     getTrack,
     updateTrack,
     insertTrack,
     removeTracks,
     getDeletedTracks,
     forceRemoveTracks,
     multipleRestoreTrack
}