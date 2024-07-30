const models = require('../models');
const Selection = models.Selection

const getResultInSelectionByStuId = async (req, res) => {
     const stuid = req.params.stuid
     try {
          const track = await Selection.findOne({
               where: {
                    stu_id: stuid
               },
               attributes: ["result"]
          })
          return res.status(200).json({
               ok: true,
               data: track
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
     getResultInSelectionByStuId
}