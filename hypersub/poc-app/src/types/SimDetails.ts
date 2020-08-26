import {Subscription} from "./Susbcription";
import {PricedEvent} from "./PricedEvent";

export interface SimDetails {
    IMSI:  string | File ;
    phoneNumber: string;
    contracts?: Array<Subscription>
    consumedPricedEvents?: Array<PricedEvent>
}