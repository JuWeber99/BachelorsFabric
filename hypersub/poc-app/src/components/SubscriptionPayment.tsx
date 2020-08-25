import React, {useState} from 'react';
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {Button, Card, CardContent, TextField} from "@material-ui/core";
import axios from "axios"
import "../styles/stripe.css"


const SubscriptionPayment = () => {

    const [email, setEmail] = useState("")

    const stripe = useStripe();
    const elements = useElements();


    const handleSubmitSub = async (event: any) => {
        if (!stripe || !elements) {
            return;
        }
        const result: any = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)!,
            billing_details: {
                email: email,
            }
        });

        if (result.error) {
            console.log(result.error.message);
        } else {
            const res = await axios.post('http://localhost:3031/sub',
                {'payment_method': result.paymentMethod!.id, 'email': email});
            const {client_secret, status} = res.data;

            if (status === 'requires_action') {
                stripe.confirmCardPayment(client_secret).then(function (result) {
                    if (result.error) {
                        console.log('There was an issue!');
                        console.log(result.error);
                        // Display error message in your UI.
                        // The card was declined (i.e. insufficient funds, card has expired, etc)
                    } else {
                        console.log('You got the money!');
                        // Show a success message to your customer
                    }
                });
            } else {
                console.log('You got the money!');
                // No additional information was needed
                // Show a success message to your customer
            }
        }
    };

    return (
        <Card className={"rooti"}>
            <CardContent className={"content"}>
                <TextField
                    label='Email'
                    id='outlined-email-input'
                    helperText={`Email you'll recive updates and receipts on`}
                    margin='normal'
                    variant='outlined'
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
                <CardElement/>
                <div className={"divi"}>
                    <Button variant="contained" color="primary" className={"btn"} onClick={handleSubmitSub}>
                        Subscription
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SubscriptionPayment;