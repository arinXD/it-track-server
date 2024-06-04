const model = require("../models");
const User = model.User;
const { decode } = require("next-auth/jwt")
require("dotenv").config();

const isAuth = async (req, res, next) => {
    const sessionToken = req.cookies['next-auth.session-token']

    if (sessionToken) {
        try {
            const decoded = await decode({
                token: sessionToken,
                secret: process.env.NEXTAUTH_SECRET,
            });

            const userRole = await User.findOne({
                where: { email: decoded.email },
                attributes: ["role"],
            });
            const role = userRole?.dataValues?.role;

            if (role) {
                next();
            } else {
                return res.status(401).json({
                    ok: false,
                    message: "Authentication failed. User does not have permission to access.",
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
            message: "Authentication failed. Token not provided. Please login.",
        });
    }
};

module.exports = isAuth;