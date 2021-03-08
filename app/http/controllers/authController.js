//This is a factory functions(it is a function which returns a object)
const User = require('../../models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');
function authContrller(){
    return {
        login(req,res) {
            res.render('auth/login')
        },
        postLogin(req,res,next) {
            const { email, password} = req.body
            //Validate request
            if(!email || !password){
                req.flash('error','All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local',(err,user,info) => {
                if(err) {
                    req.flash('error' , info.message)
                    return next(err);
                }
                if(!user){
                    req.flash('error' , info.message)
                    return res.redirect('/login');
                }
                req.login(user,(err) =>{
                    if(err){
                        req.flash('error' , info.message)
                        return next(err);
                    }
                    return res.redirect('/');
                })
            })(req,res,next)
        },
        register(req,res) {
            res.render('auth/register')
        },
        async postRegister(req,res) {
            const { name, email, password, cpassword} = req.body
            //Validate request
            if(!name || !email || !password || !cpassword){
                req.flash('error','All fields are required')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }
            else if(password != cpassword){
                req.flash('error1','Please enter same credential that you enter in password input')
                req.flash('name',name)
                req.flash('email',email)
                req.flash('password',password)
                return res.redirect('/register')
            }

            //Check email is exist
            User.exists({email : email},(err,result) =>{
                if(result) {
                    req.flash('error','Email is already taken')
                    req.flash('name',name)
                    req.flash('email',email)
                    return res.redirect('/register')
                }
            })
            //Hash password
            const hashedPassword = await bcrypt.hash(password,10)
            const hashedCpassword = await bcrypt.hash(cpassword,10)
            //create a user
            const user = new User({
                name : name,
                email : email,
                password : hashedPassword,
                cpassword : hashedCpassword
            })
            user.save().then((user) =>{
                //Login
                return res.redirect('/')
            }).catch(err =>{
                req.flash('error','Something went wrong !!')
                return res.redirect('/register')
            })
        },
        logout(req,res){
            req.logout()
            return res.redirect('/')
        }
    }
}

module.exports = authContrller