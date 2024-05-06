const model = require("../models");
const User = model.User;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuth = async (req, res, next) => {
    const authToken = req.headers["authorization"];
    if (authToken) {
        try {
            const token = jwt.verify(authToken, process.env.SECRET_KEY);
            const user = await User.findOne({
                where: {
                    email: token.data.email
                },
                attributes: ["role"],
            });
            const role = user?.dataValues?.role;
            if (role) {
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

module.exports = isAuth;