import {Address} from "./Address";
import {BankingDetails, P2PDetails, SepaDetails} from "./BankingDetails";
import {Bill} from "./Bill";
import {DTransaction} from "./DTransaction";
import {Product} from "./Product";
import {SimDetails} from "./SimDetails";
import {PersonalDetails} from "./PersonalDetails";
import {PricedEvent} from "./PricedEvent";
import {RateOption} from "./RateOption";
import {Subscription} from "./Susbcription";
import {Statement} from "./Statement";
import {CustomerAccount} from "./assets/CustomerAccountAsset";

export type CustomerAccountTypes =
    Address
    | BankingDetails<P2PDetails | SepaDetails>
    | Bill
    | DTransaction
    | Product
    | SimDetails
    | PersonalDetails
    | PricedEvent
    | RateOption
    | Subscription
    | Statement
    | CustomerAccount