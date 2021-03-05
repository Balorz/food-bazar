 import axios from 'axios'
 import { Notyf } from 'notyf';
let addToCart = document.querySelectorAll('.Add-to-cart');
let cartCounter = document.querySelector('#cartCounter');
function updateCart(food) {
    axios.post('/update-cart',food).then(res =>{
        cartCounter.innerText = res.data.totalQty 
        const notyf = new Notyf({
            duration : 800,
            position : {
                x : 'right',
                y : 'top'
            },
            ripple : false
        });
        notyf.success('Item added to cart');
    }).catch(err =>{
        const notyf = new Notyf({
            duration : 0,
            dismissible : true,
            position : {
                x : 'right',
                y : 'top'
            },
            ripple : false
        });
        notyf.error('Something went wrong');
    })
}


addToCart.forEach((btn) =>{
    btn.addEventListener('click',(e) =>{
        let food = JSON.parse(btn.dataset.food)
        updateCart(food)
    })
})