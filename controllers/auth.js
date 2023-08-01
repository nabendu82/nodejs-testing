const CryptoJS = require("crypto-js");
const User = require("../models/User");

const authRegisterConroller = async (req, res) => {
    const userData = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
        ).toString(),
    });

    try {
        const user = await userData.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { authRegisterConroller }