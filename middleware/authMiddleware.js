const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'freakbeast', (err, decodeToken) => {
            if(err){
                console.error(err);
                res.redirect('/login');
            }
            else{
                console.log(decodeToken);
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'freakbeast', async (err, decodeToken) => {
            if(err){
                res.locals.user = null;
                console.error(err);
            }
            else{
                console.log(decodeToken);
                let user = await User.findById(decodeToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };