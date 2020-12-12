const UserModel=require('../../models/user');
const bcrypt=require('bcrypt');
const passport = require('passport');
function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res,next) {
            const { email, password } = req.body;
            /// Validate Request
            if ( !email || !password) {
                req.flash('error', 'All Fields Are Required');
                return res.redirect('/login')
            }
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.login(user,(err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req,res,next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
            const { name, email, password}=req.body;
            /// Validate Request
            if(!name || !email || !password){
                req.flash('error','All Fields Are Required');
                req.flash('name',name)
                req.flash('email', email)
                req.flash('password', password)
                return res.redirect('/register')
            }
            /// Check if Email Exist
            UserModel.exists({email:email},(err,result)=>{
                if(result){
                    req.flash('error', 'Email Already Taken');
                    req.flash('name', name)
                    req.flash('email', email)
                    req.flash('password', password)
                    return res.redirect('/register')
                }
            })

            //// Hash Password
            const hashedPassword =await  bcrypt.hash(password,10)
            //// Create A user
            const user = new UserModel({
                name:name,
                email:email,
                password: hashedPassword
            })
            user.save().then((user)=>{
                // Login
                return res.redirect('/')
            }).catch((error)=>{
                req.flash('error', 'Something Went Wrong');
                return res.redirect('/register')
            })

        },
        logout(req,res){
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController;