import {Subscription} from "./Susbcription";
import {PricedEvent} from "./PricedEvent";

export class SimDetails {
    IMSI:  string;
    phoneNumber: string;
    contracts?: Array<Subscription>
    consumedPricedEvents?: Array<PricedEvent>
}