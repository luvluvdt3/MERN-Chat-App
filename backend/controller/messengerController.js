const User = require('../models/authModel');
const messageModel = require('../models/messageModel')
const formidable = require('formidable'); //much needed for working with images
const fs = require('fs'); //for files

const getLastMessage = async (myId, fdId) => { //dont need to export since its only used for implementation in getFriends
     //find messages of the current user or the current friend being either sender or receiver
     const msg = await messageModel.findOne({
          $or: [{
               $and: [{
                    senderId: {
                         $eq: myId
                    }
               }, {
                    reseverId: {
                         $eq: fdId
                    }
               }]
          }, {
               $and: [{
                    senderId: {
                         $eq: fdId
                    }
               }, {
                    reseverId: {
                         $eq: myId
                    }
               }]
          }]
     }).sort({
          updatedAt: -1 //-1 -> the lastest message
     });
     return msg;
}
module.exports.getFriends = async (req, res) => {
     const myId = req.myId;
     let fnd_msg = [];
     console.log(myId); //see the myId (current user's Id) that passed to req from authMiddleware
     try {
          //Version of friendGet using MongoDB Operators:
          const friendGet = await User.find({
               _id: {
                    $ne: myId //$ne = Matches all values that are not equal to a specified value. 
               }
          });
          //console.log(friendGet);
          for (let i = 0; i < friendGet.length; i++) {
               let lmsg = await getLastMessage(myId, friendGet[i].id);
               //fnd_msg variable contains each friend's info and the lastest message to/from them
               fnd_msg = [...fnd_msg, {
                    fndInfo: friendGet[i],
                    msgInfo: lmsg
               }]
               //  console.log(fnd_msg)
          }

          // const filter = friendGet.filter(d=>d.id !== myId );
          res.status(200).json({ success: true, friends: fnd_msg })

          //console.log(friendGet) //print out the list in terminal

          /**Version of friendGet using filter:
           * 
          const friendGet = await User.find({});
          const filter = friendGet.filter(d => d.id !== myId); //filter out the friend with the same id as current user  
          
          res.status(200).json({ success: true, friends: filter })
          */
     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Sever Error'
               }
          })
     }
}

module.exports.messageUploadDB = async (req, res) => {
     const {
          senderName,
          reseverId,
          message
     } = req.body //get all message info into variables from req

     const senderId = req.myId; //current user's id
     // console.log(senderId)
     // console.log(req.body);
     try {
          const insertMessage = await messageModel.create({ //create message table in the DATABASE
               senderId: senderId,
               senderName: senderName,
               reseverId: reseverId,
               message: {
                    text: message,
                    image: ''
               }
          })
          res.status(201).json({
               success: true,
               message: insertMessage
          })
     }
     catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Server Error'
               }
          })
     }
}

module.exports.messageGet = async (req, res) => {
     const myId = req.myId;      //user's id
     const fdId = req.params.id; //current friend's id

     try {
          //Version of MongoDB Operators
          let getAllMessage = await messageModel.find({
               $or: [{
                    $and: [{
                         senderId: {
                              $eq: myId
                         }
                    }, {
                         reseverId: {
                              $eq: fdId
                         }
                    }]
               }, {
                    $and: [{
                         senderId: {
                              $eq: fdId
                         }
                    }, {
                         reseverId: {
                              $eq: myId
                         }
                    }]
               }]
          })

          /** Filter version 
          let getAllMessage = await messageModel.find({}) //get all the messages in the database

          getAllMessage = getAllMessage.filter(m => m.senderId === myId && m.reseverId === fdId || m.reseverId === myId && m.senderId === fdId); //get only messages between the user vs current friend
          */
          res.status(200).json({
               success: true,
               message: getAllMessage
          })


     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Server error'
               }
          })

     }
}

module.exports.ImageMessageSend = (req, res) => {
     const senderId = req.myId;
     const form = formidable();

     form.parse(req, async(err, fields, files) => {
          console.log(fields) //senderName, imagename,receiverId
          console.log(files) //image: lastModifiedDate, filepath, newFilename, originalFilename,mimetype,...
          const {
               senderName,
               reseverId,
               imageName
          } = fields;
          if (!imageName.includes('/giphy.gif')) { //if is normal photo
               const newPath = __dirname + `../../../frontend/public/image/${imageName}` //imageName from the fields
               files.image.originalFilename = imageName;

               //store image in the database:
               try {
                    fs.copyFile(files.image.filepath, newPath, async (err) => {
                         if (err) {
                              res.status(500).json({
                                   error: {
                                        errorMessage: 'Image upload fail'
                                   }
                              })
                         } else {
                              const insertMessage = await messageModel.create({
                                   senderId: senderId,
                                   senderName: senderName,
                                   reseverId: reseverId,
                                   message: {
                                        text: '',
                                        image: files.image.originalFilename
                                   }
                              })
                              res.status(201).json({
                                   success: true,
                                   message: insertMessage
                              })
                         }
                    })
               } catch (error) {
                    res.status(500).json({
                         error: {
                              errorMessage: 'Internal Sever Error'
                         }
                    })
               }
          }
          else { //if it GIF link from Giphy
               try {
                    const insertMessage = await messageModel.create({
                         senderId: senderId,
                         senderName: senderName,
                         reseverId: reseverId,
                         message: {
                              text: '',
                              image: imageName
                         }
                    })
                    res.status(201).json({
                         success: true,
                         message: insertMessage
                    })
               }
               catch (error) {
                    res.status(500).json({
                         error: {
                              errorMessage: 'Internal Server Error'
                         }
                    })
               }
          }

     })
}

//update message to status "seen"
module.exports.messageSeen = async (req, res) => {
     console.log(req.body) //message's info in terminal
     const messageId = req.body._id;

     await messageModel.findByIdAndUpdate(messageId, {
          status: 'seen'
     })
          .then(() => {
               res.status(200).json({
                    success: true
               })
          }).catch(() => {
               res.status(500).json({
                    error: {
                         errorMessage: 'Internal Server Error'
                    }
               })
          })
}

//update message to status "delivared"
module.exports.delivaredMessage = async (req, res) => {
     const messageId = req.body._id;

     await messageModel.findByIdAndUpdate(messageId, {
          status: 'delivared'
     })
          .then(() => {
               res.status(200).json({
                    success: true
               })
          }).catch(() => {
               res.status(500).json({
                    error: {
                         errorMessage: 'Internal Server Error'
                    }
               })
          })
}