const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
    const { authToken } = req.cookies; //get authToken from the cookie
    if (authToken) { //if logged in
        const deCodeToken = await jwt.verify(authToken, process.env.SECRET); //decode the token to get the information associated to it
        req.myId = deCodeToken.id; //associate the logged in user's id to the req in order to pass it to messengerController through req.myId
        next(); //approve the programme to continue with next step
    } 
    else {
        res.status(400).json({
            error: {
                errorMessage: ['Please Login First']
            }
        })
    }
}