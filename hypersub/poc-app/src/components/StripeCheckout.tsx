import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import React, {useEffect, useState} from "react";
import "../styles/stripe.css"
import axios from "axios";
import {PersonalDetails} from "../types/PersonalDetails";
import {IsoCountryCodes} from "../types/IsoCountryCodes";
import infinSpinner from "../Infinity-1.1s-200px.gif";
import {PersonalDetailProps} from "./PersonalDetailSettings";
import {callFindPersonIndex, getPersonalDetailsForCustomerOnSite} from "../api_util/callApiEndpoints";


const CARD_OPTIONS = {
    style: {
        base: {
            iconColor: '#c4f0ff',
            color: '#fff',
            fontWeight: "bolder",
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
                color: '#fce883',
            },
            '::placeholder': {
                color: '#87bbfd',
            },
        },
        invalid: {
            iconColor: '#ffc7ee',
            color: '#ffc7ee',
        },
    },
};

function createTestContractForInitialCustomer(): Promise<boolean> {
    let success = fetch(`http://localhost:3031/api/createTestContractForInitialUser`)
        .then((response) => response.ok)
    return success;
}

const CardField = ({onChange}) => (
    <div className="FormRow">
        {/*// @ts-ignore*/}
        <CardElement options={CARD_OPTIONS} onChange={onChange}/>
    </div>
);

const Field = ({
                   label,
                   id,
                   type,
                   placeholder,
                   required,
                   autoComplete,
                   value,
                   onChange,
               }) => (
    <div className="FormRow">
        <label htmlFor={id} className="FormRowLabel">
            {label}
        </label>
        <input
            className="FormRowInput"
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
        />
    </div>
);

const SubmitButton = ({processing, error, children, disabled}) => (
    <button
        className={`SubmitButton ${error ? 'SubmitButton--error' : ''}`}
        type="submit"
        disabled={processing || disabled}

    >
        {processing ? 'Processing...' : children}
    </button>
);

const ErrorMessage = ({children}) => (
    <div className="ErrorMessage" role="alert">
        <svg width="16" height="16" viewBox="0 0 17 17">
            <path
                fill="#FFF"
                d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
            />
            <path
                fill="#6772e5"
                d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
            />
        </svg>
        {children}
    </div>
);

const ResetButton = ({onClick}) => (
    <button type="button" className="ResetButton" onClick={onClick}>
        <svg width="32px" height="32px" viewBox="0 0 32 32">
            <path
                fill="#FFF"
                d="M15,7.05492878 C10.5000495,7.55237307 7,11.3674463 7,16 C7,20.9705627 11.0294373,25 16,25 C20.9705627,25 25,20.9705627 25,16 C25,15.3627484 24.4834055,14.8461538 23.8461538,14.8461538 C23.2089022,14.8461538 22.6923077,15.3627484 22.6923077,16 C22.6923077,19.6960595 19.6960595,22.6923077 16,22.6923077 C12.3039405,22.6923077 9.30769231,19.6960595 9.30769231,16 C9.30769231,12.3039405 12.3039405,9.30769231 16,9.30769231 L16,12.0841673 C16,12.1800431 16.0275652,12.2738974 16.0794108,12.354546 C16.2287368,12.5868311 16.5380938,12.6540826 16.7703788,12.5047565 L22.3457501,8.92058924 L22.3457501,8.92058924 C22.4060014,8.88185624 22.4572275,8.83063012 22.4959605,8.7703788 C22.6452866,8.53809377 22.5780351,8.22873685 22.3457501,8.07941076 L22.3457501,8.07941076 L16.7703788,4.49524351 C16.6897301,4.44339794 16.5958758,4.41583275 16.5,4.41583275 C16.2238576,4.41583275 16,4.63969037 16,4.91583275 L16,7 L15,7 L15,7.05492878 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z"
            />
        </svg>
    </button>
);

export const SubscriptionCheckout = ({accountId, name, forename}: PersonalDetailProps) => {
        const stripe = useStripe();
        const elements = useElements();
        const [doLoad, setShowSpinner]: [boolean, any] = useState(true)

        const [personFetched, setPersonFetched]: [boolean, any] = useState(false);
        const [personalDetails, setPersonalDetails]: [PersonalDetails, any] = useState({
            name: '',
            forename: '',
            birthday: '',
            mailAddress: '',
            telephoneContact: '',
            address: {
                postalCode: '',
                residence: '',
                streetName: '',
                houseNumber: '',
                country: IsoCountryCodes.Germany
            }
        })
        const [personIndex, setPersonIndex]: [number, any] = useState(-1)

        const [error, setError]: any = useState(null);
        const [paymentError, setPaymentError]: [boolean, any] = useState(false)
        const [cardComplete, setCardComplete]: any = useState(false);
        const [processing, setProcessing]: any = useState(false);
        const [paymentMethod, setPaymentMethod]: any = useState(null);

        const handleSubmitSub = async (event) => {
            event.preventDefault();

            if (!stripe || !elements) {
                return;
            }


            if (error) {
                elements.getElement('card')?.focus()
                return;
            }

            if (cardComplete) {
                console.log("card complete")
                setProcessing(true);
            }


            const payload = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement)!,
                billing_details: {
                    email: personalDetails.mailAddress,
                    name: personalDetails.name,
                    phone: personalDetails.telephoneContact
                },
            });

            if (payload.error) {
                setError(payload.error);
                console.log("payload error")
            } else {
                setPaymentMethod(payload.paymentMethod);
                const serverResponse = await axios.post('http://localhost:3031/sub',
                    {'payment_method': payload.paymentMethod!.id, 'email': personalDetails.mailAddress});

                const {client_secret, status} = serverResponse.data;

                if (serverResponse.data.error) {
                    console.log("an Error occurred")
                    setError({
                        message: serverResponse.data.error.message,
                        statusCode: serverResponse.data.error.statusCode
                    })
                    setPaymentError(true)
                    setProcessing(false)
                    console.log(paymentMethod)
                    return
                }

                if (status === 'requires_action') {
                    stripe.confirmCardPayment(client_secret).then(function (result) {
                        if (result.error) {
                            console.log('There was an issue!');
                            console.log(result.error);
                            setError(result.error);
                            setPaymentError(true)
                            setProcessing(false)
                            // Display error message in your UI.
                            // The card was declined (i.e. insufficient funds, card has expired, etc)
                        } else {
                            console.log('You got the money!');
                            setProcessing(false)
                            setPaymentError(false)
                            // Show a success message to your customer
                        }
                    });
                } else {
                    console.log('You got the money!');
                    setProcessing(false)
                    setPaymentError(false)

                    // No additional information was needed
                    // Show a success message to your customer
                }
            }
        };

        const reset = () => {
            setError(null);
            setProcessing(false);
            setPaymentMethod(null);
            setPersonalDetails({
                email: personalDetails.mailAddress,
                phone: personalDetails.telephoneContact,
                name: personalDetails.name + " " + personalDetails.forename,
            });
        };


        useEffect(() => {
            async function fetchCorrectPersonalDetails() {
                const index = await callFindPersonIndex(accountId, name, forename);
                setPersonIndex(index)
                const details = await getPersonalDetailsForCustomerOnSite(accountId, index);
                setPersonalDetails(details)
            }

            fetchCorrectPersonalDetails()
                .then(() => setPersonFetched(true))
                .then(() => setShowSpinner(false))
                .catch((err) => {
                    setError(true)
                    setShowSpinner(false)
                })
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [personFetched])


        return paymentMethod && !paymentError && !doLoad ? (
            <div className="Result">
                <div className="ResultTitle" role="alert">
                    Payment successful
                </div>
                <div className="ResultMessage">
                    Thanks for trying Stripe Elements. No money was charged, but we
                    generated a PaymentMethod: {paymentMethod.id}
                </div>
                <ResetButton onClick={() => {
                    createTestContractForInitialCustomer();
                    reset()
                }}/>
            </div>
        ) : !doLoad ? (
            <form className="Form" onSubmit={handleSubmitSub}>
                <fieldset className="FormGroup">
                    <Field
                        label="Name"
                        id="name"
                        type="text"
                        placeholder="Test User"
                        required
                        autoComplete="name"
                        value={personalDetails.name}
                        onChange={(e) => {
                            setPersonalDetails({
                                ...personalDetails,
                                name: e.target.value.toString().split(" ")[1],
                                forename: e.target.value.toString().split(" ")[0]
                            });
                        }}
                    />
                    <Field
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="test@testmail.com"
                        required
                        autoComplete="email"
                        value={personalDetails.mailAddress}
                        onChange={(e) => {
                            setPersonalDetails({...personalDetails, mailAddress: e.target.value});
                        }}
                    />
                    <Field
                        label="Phone"
                        id="phone"
                        type="tel"
                        placeholder="(941) 555-0123"
                        required
                        autoComplete="tel"
                        value={personalDetails.telephoneContact}
                        onChange={(e) => {
                            setPersonalDetails({...personalDetails, telephoneContact: e.target.value});
                        }}
                    />
                </fieldset>
                <fieldset className="FormGroup">
                    <CardField
                        onChange={(e) => {
                            setError(e.error);
                            setCardComplete(e.complete);
                        }}
                    />
                </fieldset>

                {error && <ErrorMessage>{error.statusCode}: {error.message}</ErrorMessage>}

                <SubmitButton processing={processing} error={error} disabled={!stripe}>
                    Subscripe
                </SubmitButton>
            </form>
        ) : <img style={{marginTop: "20%"}} src={infinSpinner}/>;
    };