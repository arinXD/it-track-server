const model = require("../models");
const User = model.User;
const jwt = require("jsonwebtoken");
const { decode } = require("next-auth/jwt")
require("dotenv").config();

const isAuth = async (req, res, next) => {
    const sessionToken = req.cookies['next-auth.session-token']
    const headerToken = req.headers["authorization"]

    if (sessionToken || headerToken) {
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
        }
        else {
            try {
                const user = jwt.verify(headerToken, process.env.SECRET_KEY);

                const userRole = await User.findOne({
                    where: { email: user.data.email },
                    attributes: ["role"],
                });
                const role = userRole?.dataValues?.role

                if (role) {
                    next();
                } else {
                    return res.status(401).json({
                        ok: false,
                        message: "Authentication failed. User does not have an account.",
                    });
                }
            } catch (err) {
                let message = null
                if (err.name === 'TokenExpiredError') {
                    message = "Authentication failed. Token expired."
                } else {
                    message = "Authentication failed. Invalid token."
                }
                return res.status(401).json({
                    ok: false,
                    message,
                });
            }
        }
    } else {
        return res.status(401).json({
            ok: false,
            message: "Authentication failed. Token not provided. Please login.",
        });
    }
};

module.exports = isAuth;