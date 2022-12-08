const formidable = require('formidable'); //creat form to parse 
const validator = require('validator');
const registerModel = require('../models/authModel');
const fs = require('fs'); //file manager, have this package by default
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
module.exports.userRegister = (req, res) => {
    console.log('working')
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        //fields is all the input of the request sent by method fileHandler in frontend/src/components/Register.js
        // files is all images, files,...
        const {
            userName, email, password, confirmPassword
        } = fields;

        const { image } = files;
        const error = [];
        //error.push wont help showing the error to the terminal but to send it to console.log as a servere error
        if (!userName) {
            error.push('Please provide your user name');
        }
        if (!email) {
            error.push('Please provide your Email');
        }
        if (email && !validator.isEmail(email)) {  //check if is email or not with validator package
            error.push('Please provide your Valid Email');
        }
        if (!password) {
            error.push('Please provide your Password');
        }
        if (!confirmPassword) {
            error.push('Please provide your confirm Password');
        }
        if (password && confirmPassword && password !== confirmPassword) {
            error.push('Your Password and Confirm Password not same');
        }
        if (password && password.length < 6) {
            error.push('Please provide password mush be 6 charecter');
        }
        if (Object.keys(files).length === 0) {
            error.push('Please provide user image');
        }
        if (error.length > 0) {
            res.status(400).json({
                error: {
                    errorMessage: error
                }
            })
        }
        else {
            const getImageName = files.image.originalFilename;
            const randNumber = Math.floor(Math.random() * 99999);
            const newImageName = randNumber + getImageName; //so new name would be like 12594imageName.jpg
            files.image.originalFilename = newImageName;

            const newPath = __dirname + `../../../frontend/public/image/${files.image.originalFilename}`; //store the image in here 

            try {
                const checkUser = await registerModel.findOne({
                    email: email
                }); //look for the user with the same email in the database
                if (checkUser) { //if email already exists  
                    res.status(404).json({
                        error: {
                            errorMessage: ['Your email already existed']
                        }
                    })
                }
                else {        //paste the image in newPath
                    fs.copyFile(files.image.filepath, newPath, async (error) => {
                        if (!error) { //if there aint no error
                            const userCreate = await registerModel.create({
                                userName,
                                email,
                                password: await bcrypt.hash(password, 10), //crypt the password into 10 characters
                                image: files.image.originalFilename
                            })//create  new user
                            const token = jwt.sign({ //create token associated with the browser for user(to avoid signing in everytime)
                                id: userCreate._id,  //get new user's id from the database,, which was created automatically by MongoDB
                                email: userCreate._email,
                                userName: userCreate.userName,
                                image: userCreate.image,
                                registerTime: userCreate.createdAt
                            },//information to save with the token
                                process.env.SECRET,//get the secret key from config.env
                                {
                                    expiresIn: process.env.TOKEN_EXP // wil be expired in the time cited in config.env
                                })
                            const options = { expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }//expire date of cookie: 24h
                            res.status(201).cookie('authToken', token, options).json({
                                successMessage: 'Your Register Successful', token
                            }) //save all the token infos into the cookie named authToken
                            // can see the saved cookie in Console->Application->Cookie
                            console.log(token) // is a really longggg list of characters
                            console.log('registration completed') // shown in terminal
                        }
                        else {
                            res.status(500).json({
                                error: {
                                    errorMessage: ['Interanl Server Error']
                                }
                            })
                        }
                    })
                }

            } catch (error) {
                res.status(500).json({
                    error: {
                        errorMessage: ['Interanl Server Error']
                    }
                })
            }
        }
    }) // end Formidable  
}

module.exports.userLogin = async (req, res) => {
    //console.log(req.body) //will print out { email: 'tu123@gmail.com', password: '123456' }
    const error = [];
    const { email, password } = req.body
    if (!email) {
        error.push('Please provide your email')
    }
    if (!password) {
        error.push('Please provide your password')
    }
    if (email && !validator.isEmail(email)) {
        error.push('Please provide your valid email')
    }
    if (error.length > 0) {//if there is error
        res.status(400).json({
            error: {
                errorMessage: error
            }
        })
    }
    else {
        try {
            const checkUser = await registerModel.findOne({
                email: email
            }).select('+password'); //have to +password to include the crypted password in variable checkUser
            //console.log(checkUser) //print out in terminal the user's information 
            
            if (checkUser) {
                const matchPassword = await bcrypt.compare(password, checkUser.password); //check if the password entered is the same as the crypted password in the database
                if (matchPassword) {
                    const token = jwt.sign({ //generate new token
                        id: checkUser._id,
                        email: checkUser.email,
                        userName: checkUser.userName,
                        image: checkUser.image,
                        registerTime: checkUser.createdAt
                    }, process.env.SECRET, {
                        expiresIn: process.env.TOKEN_EXP
                    });
                    const options = { expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }

                    res.status(200).cookie('authToken', token, options).json({ //save(or replace) the newly generated token into the cookie 
                        successMessage: 'Your Login Successful', token
                    })

                } else {
                    res.status(400).json({
                        error: {
                            errorMessage: ['Your Password not Valid']
                        }
                    })
                }
            } else {
                res.status(400).json({
                    error: {
                        errorMessage: ['Your Email Not Found']
                    }
                })
            }
//Can see the error or succes message in the Postman

        } catch {
            res.status(404).json({
                error: {
                    errorMessage: ['Internal Sever Error']
                }
            })

        }
    }

}



