const LocalStrategy = require('passport-local').Strategy;
const bcyrpt = require('bcryptjs');

const User = require('../models/users');

// verfying user
module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'},(email,password,done)=>{
        User.findOne({email:email})
        .then(user=>{
            if(!user)
            {
                return done(null,false,{message:'Invalid credentials'});
            }
             bcyrpt.compare(password,user.password,(err,isMatch)=>{
                if(err)
                  throw err;
                if(isMatch){
                    return done(null,user)
                }
                else{
                    return done(null,false,{message:'Invalid credentials'})
                }
             })
            
        })
        .catch(err=>console.log(err))
     })
    )
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id)
        .then(()=> done(null,user))
        .catch((err)=>console.log(err))
    })      
}