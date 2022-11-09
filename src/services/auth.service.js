const db = require('../models');
const sharedResponse = require('../shared/shared.response');
const validators = require('../validators/validate.duplicates');
const User = db.userModel;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const jwt_decode = require('jwt-decode');

dotenv.config();

exports.userLogin = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user && user.active == '1') {
            const password_valid = await bcrypt.compare(req.body.password, user.password);
            if (password_valid) {

                let token = jwt.sign({
                    "id": user.sys_user_id,
                    "email": user.email,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "user_type": user.user_type
                }, 'S3cR5rteuwebwnnnb3VVL9u', { expiresIn: '1h' });
                res.status(200).json({
                    "token": token,
                    "resp_message": "Login successful",
                    "resp_code": "00"
                });


            } else {
                res.status(401).send({
                    resp_message: "Incorrect Login Credentials!",
                    resp_code: '05'
                });
            }

        } else {
            res.send(
                {
                    resp_message: "User does not exist",
                    resp_code: '01'
                });
        }

    } catch (error) {
        res.send({
            resp_code: '02',
            resp_message: error.message
        });
    }
}

exports.authorizeRequest = (req, res, next) => {
    // console.log(req?.headers['authorization'].split(' ')[1]);
    console.log('AUTH TOKEN ....0000', req.headers['authorization']);
    try {
        if (!req.headers['authorization']) {
            res.status(400).json({ resp_message: "No access token provided!" });
        }
        else {
            let token = req.headers['authorization'].split(' ')[1];
            jwt.decode()
            global.token = jwt_decode(token);
            jwt.verify(token, "S3cR5rteuwebwnnnb3VVL9u", (err, user) => {
                if (err) {
                    res.status(401).json({ resp_message: 'Unauthorized access, ' + err.message });
                } else {
                    req.user = user;
                    global.user = user;
                    next();
                }
            })
        }
    } catch (error) {
        res.send({
            resp_message: "Could not process the request, " + error.message,
            resp_code: '01'
        })
    }
}
exports.resetPasswordRequest = async (req, res) => {

    try {
        let email = req.body.email
        let currentPassword = req.body.current_password
        let user = await User.findOne({ where: { email: email } });
        const password_valid = await bcrypt.compare(currentPassword, user.password);
        if (password_valid) {
            let password = {
                password: await bcrypt.hash(req.body.new_password, salt)
            }
            User.update(password, { where: { email: email } })
                .then(() => {
                    res.status(200).send({
                        resp_code: '00',
                        message: "password reset successful"
                    })
                })
        } else {
            res.status(401).send({
                resp_code: '01',
                message: "Your current password is incorrect!"
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}