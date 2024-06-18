const model = require("../models");
const User = model.User;
const jwt = require("jsonwebtoken");
const { decode } = require("next-auth/jwt");
require("dotenv").config();

const authenticateUser = async (email, res, next) => {
    try {
        const user = await User.findOne({
            where: { email },
            attributes: ["email"],
        });

        if (user && user?.dataValues?.email) {
            next();
        } else {
            return res.status(401).json({
                ok: false,
                message: "Authentication failed. User does not have an account.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

const isAuth = async (req, res, next) => {
    const sessionToken = req.cookies['next-auth.session-token'];
    const headerToken = req.headers["authorization"];

    if (!sessionToken && !headerToken) {
        return res.status(401).json({
            ok: false,
            message: "Authentication failed. Token not provided. Please login.",
        });
    }

    if (sessionToken) {
        try {
            const decoded = await decode({
                token: sessionToken,
                secret: process.env.NEXTAUTH_SECRET,
            });

            if (!decoded || !decoded.email) {
                return res.status(401).json({
                    ok: false,
                    message: "Authentication failed. Invalid session token structure.",
                });
            }

            return authenticateUser(decoded.email, res, next);
        } catch (err) {
            console.error("Session token decoding error:", err);
            return res.status(401).json({
                ok: false,
                message: "Authentication failed. Invalid session token.",
            });
        }
    } else if (headerToken) {
        try {
            const user = jwt.verify(headerToken, process.env.SECRET_KEY);

            if (!user?.data?.email) {
                return res.status(401).json({
                    ok: false,
                    message: "Authentication failed. Invalid header token structure.",
                });
            }

            return authenticateUser(user.data.email, res, next);
        } catch (err) {
            console.error("Header token verification error:", err);
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
};

module.exports = isAuth;
