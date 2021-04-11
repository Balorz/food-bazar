import { loadStripe } from '@stripe/stripe-js'
import {placeOrder} from './apiservices'
export async function initStripe(){
    const stripe = await loadStripe('pk_test_51Ie2ukSIRUFhKXRSIPaF3quaMTVVMR7If6G1LNWogCi2L0JN3O51Xy9vvvK6wJ3m5E3lSl5IrgK59OyA12Zw4LxP00ljvr5kSZ');
    let card = null;
    function mountWidget(){
        const elements = stripe.elements()
        let style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
                }
            };
        card = elements.create('card',{style})
        card.mount('#card-element')
    }
    const paymentType = document.querySelector('#paymentType')
    if(!paymentType) {
        return;
    }
    paymentType.addEventListener('change' , (e) =>{
        console.log(e.target.value);
        if(e.target.value === 'card'){
            //display widget
            mountWidget();
        } else{
            card.destroy();
        }
    })
    // Ajax Call
    const paymentForm = document.querySelector('#payment-form');
    if(paymentForm){
        paymentForm.addEventListener('submit',(e) =>{
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {}
            for(let [key, value] of formData.entries()){
                formObject[key] = value
            }
            if (!card) {
                 // Ajax
                 placeOrder(formObject);
                 return; 
            }
            // Verify card
            stripe.createToken(card).then((result) =>{
                formObject.stripeToken = result.token.id;
                placeOrder(formObject);
            }).catch((err) =>{
                console.log(err);
            }) 
        })    
    }
}