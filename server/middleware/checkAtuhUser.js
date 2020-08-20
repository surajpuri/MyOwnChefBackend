const jwt = require('jsonwebtoken');
const user = require('../models/user');

module.exports = (req, res, next) => {
    console.log(req.headers.authorization);
    try{
        const token = req.headers.authorization.split(" ")[1]; //accessing after bearer i.e bearer token
        const decoded = jwt.verify(token, process.env.secret_key);
        console.log(decoded);
    
        
        //Making sure that user is in database
        user.find({_id: decoded.userId})
        .exec()
        .then(result => {
            if(result.length == 0){
                return res.status(401).json({
                    message : 'Auth failed'
                });
            }
        });


        next();
    } catch(error) {
        return res.status(401).json({
            message : 'Auth failed'
        });

    }
}