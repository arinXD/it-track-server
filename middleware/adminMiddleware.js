const model = require("../models");
const User = model.User;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessRoll = ["admin", "teacher"];

const isAdmin = async (req, res, next) => {
    const authToken = req.headers["authorization"];
    if (authToken) {
        try {
            const user = jwt.verify(authToken, process.env.SECRET_KEY);
            const userRole = await User.findOne({
                where: { email: user.data.email },
                attributes: ["role"],
            });
            let role;

            if (userRole) {
                role = userRole.dataValues.role;
            }

            if (accessRoll.includes(role)) {
                next();
            } else {
                return res.status(401).json({
                    ok: false,
                    message: "Authentication failed. User does not have the required role.",
                });
            }
        } catch (err) {
            // Handle wrong secret key
            return res.status(401).json({
                ok: false,
                message: "Authentication failed. Invalid token.",
            });
        }
    } else {
        return res.status(401).json({
            ok: false,
            message: "Authentication failed. Token not provided.",
        });
    }
};

module.exports = isAdmin;
