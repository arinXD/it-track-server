const model = require("../models");
const Student = model.Student;
const { decode } = require("next-auth/jwt");
require("dotenv").config();

const accessRoles = ["admin", "teacher"];

const validateStudent = async (req, res, next) => {
     const sessionToken = req.cookies['next-auth.session-token'];
     const requestedStudentId = req.params.stuid;

     if (!sessionToken) {
          return res.status(401).json({
               ok: false,
               message: "Authentication failed. Token not provided. Please login.",
          });
     }

     try {
          const decoded = await decode({
               token: sessionToken,
               secret: process.env.NEXTAUTH_SECRET,
          });

          if (!decoded || !decoded.email) {
               return res.status(401).json({
                    ok: false,
                    message: "Authentication failed. Invalid token structure.",
               });
          }

          if(accessRoles.includes(decoded?.role)){
               return next()
          }

          const studentData = await Student.findOne({
               where: { email: decoded?.email },
          });

          const studentID = studentData?.dataValues?.stu_id;
          if (requestedStudentId === studentID) {
               return next()
          } else {
               return res.status(403).json({
                    ok: false,
                    message: "Authorization failed. User does not have permission to access.",
               });
          }
     } catch (err) {
          console.error("Token decoding error:", err)
          return res.status(401).json({
               ok: false,
               message: "Authentication failed. Invalid token.",
          });
     }
};

module.exports = validateStudent;
