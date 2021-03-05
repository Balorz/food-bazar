//This is a factory functions(it is a function which returns a object)
const Menu = require("../../models/menu")
function homeContrller(){
    return {
        async index(req,res) {
            const food = await Menu.find();
            return res.render('home',{food : food})
        }
    }
}

module.exports = homeContrller