const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { authRegisterConroller } = require("../controllers/auth");

//REGISTER
router.post("/register", authRegisterConroller);

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(401).json("Wrong password or username!");

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const origPassword = bytes.toString(CryptoJS.enc.Utf8);

        origPassword !== req.body.password &&
            res.status(401).json("Wrong password or username!");

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "5d" }
        );

        const { password, ...other } = user._doc;
        res.status(200).json({ ...other, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;