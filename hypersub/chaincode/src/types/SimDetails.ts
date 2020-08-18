import {Subscription} from "./Susbcription";
import {PricedEvent} from "./PricedEvent";

export interface SimDetails {
    identity:  string | File ;
    phoneNumber: string;
    activeContracts?: Array<Subscription>
    consumedPricedEvents?: Array<PricedEvent>
}