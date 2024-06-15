const express = require('express');
const authRoute = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require('../../models/UserModel.js');


authRoute.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log({ email, password });

    const user = await userModel.findOne(
        { email },
        {
            __v: 0,
            created_at: 0,
            updated_at: 0,
            otp_secret: 0,
            otp_email_secret: 0
        }
    );
    console.log('user', user);
    if (!user) {
        // res.send({ code: 400, status: 'failed', msg: "User doesn't exists" }).status(400);
        res.send({
            status: false,
            message: "User doesn't exists",
            status_code: 401
        })
    }
    else {
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.send({
                status: false,
                message: "Invalid Password",
                status_code: 400
            })
        }
        else {
            const token = jwt.sign({ id: user._id }, 'FQ394TQ-394UT93QTQ34TRWER', {
                expiresIn: "7 days"
            });

            const {
                _doc: { _id, password: dbPassword, ...userDetail }
            } = user;

            res.send({
                status: true,
                message: "User Details",
                status_code: 200,
                data: userDetail,
                token: token,
                id: user._id
            });
        }
    }
});

authRoute.post('/signup', async (req, res) => {
    console.log('signup called');

    const { email, password } = req.body;
    const user = await userModel.exists({ email });
    if (user) {
        res.send({
            status: false,
            message: "User already exists",
            status_code: 409
        })
    }
    else {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        req["body"]["password"] = hash;
        const newUser = new userModel(req["body"]).save();

        res.send({
            status_code: 200,
            status: true,
            message: "Signup Success. Kindly Proceed with login"
        });
    }
});

//     async getUserDetailById(req) {
//     const user = await PollModel.findById(req.user.id).select("-password");

//     if(!user) throw AppError(errorCodes["USER_NOT_FOUND"]);

//     return { data: user };
// }


module.exports = authRoute;
