import axios from 'axios'
import moment from 'moment';
import { Notyf } from 'notyf';
import { initAdmin } from './admin'
let addToCart = document.querySelectorAll('.Add-to-cart');
let cartCounter = document.querySelector('#cartCounter');
function updateCart(food) {
    axios.post('/update-cart', food).then(res => {
        cartCounter.innerText = res.data.totalQty
        const notyf = new Notyf({
            duration: 800,
            position: {
                x: 'right',
                y: 'top'
            },
            ripple: false
        });
        notyf.success('Item added to cart');
    }).catch(err => {
        const notyf = new Notyf({
            duration: 0,
            dismissible: true,
            position: {
                x: 'right',
                y: 'top'
            },
            ripple: false
        });
        notyf.error('Something went wrong');
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let food = JSON.parse(btn.dataset.food)
        updateCart(food)
    })
})

// Remove alert message after x second

const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() =>{
        alertMsg.remove()
    },1000)
}

// change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order){
    statuses.forEach((status) =>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true 
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
              status.nextElementSibling.classList.add('current')
            }
        }    
    })
}

updateStatus(order);

// Socket
let socket = io()
initAdmin(socket)
//join
if(order){
    socket.emit('join',`order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom')
}

socket.on('orderUpdated',(data) =>{
    const updatedOrder = { ...order } // copy orders
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    const notyf = new Notyf({
        duration: 800,
        position: {
            x: 'right',
            y: 'top'
        },
        ripple: false
    });
    notyf.success('Order Updated');
})