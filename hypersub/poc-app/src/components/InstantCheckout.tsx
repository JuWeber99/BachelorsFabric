// @ts-ignore
import {Tick} from "react-crude-animated-tick";
import React, {RefObject, useEffect, useRef, useState} from "react"
import "../styles/payment-checkout.css"
import "../styles/payment-success.css"
import SubscriptionInformationCard, {SubscriptionProps} from "./SubscriptionInformationCard";
import loadingSpinner from "../Spinner-1s-200px.gif"
import { Button } from "@material-ui/core";

export const globalCurrencyCodeEuro = "EUR"

export const InstantCheckout = ({subscriptionContract}: SubscriptionProps) => {
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
                    tag.src = `https://www.paypal.com/sdk/js?&client-id=Acuj5ntZTvSRHy0k09oJdkweHFl2TAdqYUpRFvQr_MTcmx6196nhIrfoUJ8XIQu_r_YMp2XVXDrj0Gks&currency=${globalCurrencyCodeEuro}`

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
                                    description: subscriptionContract.subscriptionProduct.productType.toString(),
                                    amount: {
                                        currency_code: globalCurrencyCodeEuro,
                                        value: subscriptionContract.subscriptionProduct.cost,
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
    }, [loaded, subscriptionContract.subscriptionProduct]);


    if (paidFor) {
        return (
            <div className={"payment-received"}>
                <h1>Payment received!</h1>
                <h2> Have fun with your service!</h2>
                <h2>Vertrags-Kennung: {subscriptionContract.contractId}!</h2>
                <Tick size={200}/>
                <Button
                    onClick={() => {
                        console.log("go back!")
                        setPaidFor(false)
                        setLoaded(false)
                    }}
                > Back !
                </Button>
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
            <ul>
                <h1>Checkout für sofortige Zahlung</h1>
                <SubscriptionInformationCard subscriptionContract={subscriptionContract}/>
            </ul>

            {
                !loaded &&
                <React.Fragment>
                    <h3> Loading PayPal connection ...</h3>
                    <img src={loadingSpinner}/>
                </React.Fragment>
            }
            <div ref={paypalRef}/>
        </div>
    );
}
