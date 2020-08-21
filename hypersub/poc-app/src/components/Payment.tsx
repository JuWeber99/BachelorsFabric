// @ts-ignore
import {Tick} from "react-crude-animated-tick";
import React, {RefObject, useEffect, useRef, useState} from "react"
import "../styles/payment-checkout.css"
import "../styles/payment-success.css"
import {Redirect} from "react-router";

export const Payment = ({product}: any) => {
    const [paidFor, setPaidFor] = useState(false);
    const [error, setError]: [any | null, any] = useState(null);
    const [loaded, setLoaded]: [boolean, any] = useState(false);
    const paypalRef: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null = useRef(null);


    useEffect(() => {
        console.log("render")
        // Load PayPal script
        if (!loaded) {
            new Promise(resolve => {
                if (!loaded) {
                    const target = document.body;
                    const tag = document.createElement('script');
                    tag.async = false;
                    tag.id = 'paypal-script';
                    tag.src = 'https://www.paypal.com/sdk/js?client-id=Acuj5ntZTvSRHy0k09oJdkweHFl2TAdqYUpRFvQr_MTcmx6196nhIrfoUJ8XIQu_r_YMp2XVXDrj0Gks';
                    target.appendChild(tag);
                    tag.addEventListener('load', () => {
                        setLoaded(true)
                    });
                }
            })
        }

        if (loaded) {
            // @ts-ignore
            window.paypal
                .Buttons({
                    // @ts-ignore
                    createOrder: (data, actions: { order: { create: (arg0: { purchase_units: { description: any; amount: { currency_code: string; value: any; }; }[]; }) => any; }; }) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    description: product.description,
                                    amount: {
                                        currency_code: 'USD',
                                        value: product.price,
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data: any, actions: { order: { capture: () => any; }; }) => {
                        const order = await actions.order.capture();
                        setPaidFor(true);
                        console.log(order);
                    },
                    onError: (err: React.SetStateAction<any>) => {
                        setError(err);
                        console.error(err);
                    },
                })
                .render(paypalRef.current);
        }
    }, [loaded, product.description, product.price]);

    if (paidFor) {
        return (
            <div className={"payment-received"}>
                <h1>Payment received!</h1>
                <h2> Have fun with : {product.name}!</h2>
                <Tick size={200}/>
                <button
                    onClick={() => {
                        console.log("go back!")
                        setPaidFor(false)
                        setLoaded(false)
                    }}
                > Back !
                </button>
            </div>
        );
    }


    return (
        <div className={"payment-checkout"}>
            {
                error &&
                <div>
                    Uh oh, an error occurred! {error?.message}
                </div>
            }
            <h1>
                {product.description} for ${product.price}
            </h1>
            <img alt={product.description} src={product.image} />
            <div ref={paypalRef}/>
        </div>
    );
}
