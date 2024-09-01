const models = require('../models');
const Notification = models.Notification
const User = models.User

const userAttr = ["email"]

const getNotificationByEmail = async (req, res) => {
     const email = req.params.email
     try {
          const petitions = await Notification.findAll({
               where: { isRead: false },
               order: [
                    ["createdAt", "desc"]
               ],
               include: [
                    {
                         model: User,
                         attributes: userAttr,
                         as: 'user',
                         where: {
                              email
                         }
                    },
               ]
          })
          return res.status(200).json({
               ok: true,
               data: petitions
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const readNotification = async (req, res) => {
     const id = req.params.id
     try {
          await Notification.update({ isRead: true }, {
               where: { id }
          })
          return res.status(200).json({
               ok: true,
               message: "you read the notification"
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

module.exports = {
     getNotificationByEmail,
     readNotification
}