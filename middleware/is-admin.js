const userModel = require('../models/user')



module.exports = (req,res,next)=>{

    userid = req.userId;

    userModel.findById(userid).then(user=>{
        if(!user){
            const error = new Error('no user found');
            error.statusCode = 500;
            throw error;
        }
        

        if(!user.isAdmin){
            const error = new Error('not allow to do this');
            error.statusCode = 500;
            throw error;
        }
        
        next();

    }).catch(err => {
        if(!err.statusCode){
            err.statusCode =500;   
        }
        next(err);
    })
    
}