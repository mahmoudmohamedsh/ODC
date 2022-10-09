const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");
dotenv.config();
module.exports = (req,res,next)=>{
    const authHeader= req.get('Authorization');

    if(!authHeader){
        const error = new Error('not authenticated')
            error.statusCode = 401;
            throw error;
    }

    const token = authHeader.split(' ')[1];

    let decodedtoken;

    try{
        decodedtoken = jwt.verify(token,process.env.APP_SEC);
    }catch(error){
        error.statusCode =500;
        throw error;
    }

    if(!decodedtoken){
        const error = new Error('not authenticated')
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedtoken.userId;
    next();
}