const Menu = require("../../models/menu")
function menuController(){
    return {
        async index(req,res) {
            const food = await Menu.find();
            return res.render('menu',{food : food})
        }
    }
}

module.exports = menuController
