const model = require("../models");
const Student = model.Student;
const User = model.User;
const { decode } = require("next-auth/jwt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const accessRoles = ["admin", "teacher"];

const validateStudent = async (req, res, next) => {
    const requestedStudentId = req.params.stuid;
    const sessionToken = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];
    const headerToken = req.headers["authorization"];

    try {
        let email, role;

        if (sessionToken) {
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
            email = decoded.email;
            role = decoded.role;
        } else if (headerToken) {
            const user = jwt.verify(headerToken, process.env.SECRET_KEY);
            email = user?.data?.email;
            if (!email) {
                return res.status(401).json({
                    ok: false,
                    message: "Authentication failed. Invalid header token structure.",
                });
            }
            const userRole = (await User.findOne({
                where: { email },
                attributes: ["role"]
            }))?.dataValues;
            role = userRole?.role;
        } else {
            return res.status(401).json({
                ok: false,
                message: "Authentication failed. Token not provided. Please login.",
            });
        }

        if (accessRoles.includes(role)) {
            return next();
        }

        const studentData = await Student.findOne({
            where: { email },
        });

        const studentID = studentData?.dataValues?.stu_id;
        if (requestedStudentId === studentID) {
            return next();
        } else {
            return res.status(403).json({
                ok: false,
                message: "Authorization failed. User does not have permission to access.",
            });
        }
    } catch (error) {
        console.error("Token verification error:", error);
        let message = "Authentication failed. Invalid token.";
        if (error.name === 'TokenExpiredError') {
            message = "Authentication failed. Token expired.";
        }
        return res.status(401).json({
            ok: false,
            message,
            error
        });
    }
};

module.exports = validateStudent;