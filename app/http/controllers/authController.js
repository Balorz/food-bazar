//This is a factory functions(it is a function which returns a object)
function authContrller(){
    return {
        login(req,res) {
            res.render('auth/login')
        },
        register(req,res) {
            res.render('auth/register')
        }
    }
}

module.exports = authContrller