import axios from 'axios'
import { Notyf } from 'notyf';
export function placeOrder(formObject){
    axios.post('/orders',formObject).then((res) =>{
        const notyf = new Notyf({
            duration: 800,
            position: {
                x: 'right',
                y: 'top'
            },
            ripple: false
        });
        notyf.success(res.data.message);
        setTimeout(() => {
            window.location.href = '/customers/orders'; 
        }, 1000);
    }).catch((err) =>{
        const notyf = new Notyf({
            duration: 0,
            dismissible: true,
            position: {
                x: 'right',
                y: 'top'
            },
            ripple: false
        });
        notyf.error(err.res.data.message);
    })
    console.log(formObject);
}