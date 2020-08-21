import { Subscription } from "./Susbcription";
import { PricedEvent } from "./PricedEvent";
export interface SimDetails {
    identity: string | File;
    phoneNumber: string;
    contracts?: Array<Subscription>;
    consumedPricedEvents?: Array<PricedEvent>;
}
