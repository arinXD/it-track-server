const model = require("../models");
const Student = model.Student;
const { decode } = require("next-auth/jwt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const accessRoles = ["admin", "teacher"];

const validateStudent = async (req, res, next) => {
     const requestedStudentId = req.params.stuid;
     const sessionToken = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];
     const headerToken = req.headers["authorization"];

     if (sessionToken) {
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
          } catch (error) {
               console.error("Token decoding error:", error)
               return res.status(401).json({
                    ok: false,
                    message: "Authentication failed. Invalid token.",
                    sessionError: error
               });
          }
     } else if (headerToken) {
          try {
              const user = jwt.verify(headerToken, process.env.SECRET_KEY);
              const email = user?.data?.email
              if (!email) {
                  return res.status(401).json({
                      ok: false,
                      message: "Authentication failed. Invalid header token structure.",
                  });
              }
  
               const studentData = await Student.findOne({
                    where: { email: email },
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

          } catch (error) {
              console.error("Header token verification error:", error);
              let message = null
              if (error.name === 'TokenExpiredError') {
                  message = "Authentication failed. Token expired."
              } else {
                  message = "Authentication failed. Invalid token."
              }
              return res.status(401).json({
                  ok: false,
                  message,
                  tokenError: error
              });
          }
      }else{
          return res.status(401).json({
               ok: false,
               message: "Authentication failed. Token not provided. Please login.",
          });
      }

};

module.exports = validateStudent;
