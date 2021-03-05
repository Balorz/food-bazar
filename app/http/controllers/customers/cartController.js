//This is a factory functions(it is a function which returns a object)
function cartContrller(){
    return {
        index(req,res) {
            res.render('customers/cart')
        },
        update(req,res) {
            // for the first time creating cart and adding basic object structure            
            if(!req.session.cart){
                req.session.cart = {
                    items : {},
                    totalQty : 0,
                    totalPrice : parseInt(0)
                }
            }
            let cart = req.session.cart
            
            //check if item does not exist in cart
            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {
                    item : req.body,
                    qty : 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            return res.json({totalQty : req.session.cart.totalQty})
        }
    }
}

module.exports = cartContrller