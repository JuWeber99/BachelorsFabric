import { Subscription } from "./Susbcription";
import { PricedEvent } from "./PricedEvent";
export declare class SimDetails {
    identity: string | File;
    phoneNumber: string;
    contracts?: Array<Subscription>;
    consumedPricedEvents?: Array<PricedEvent>;
}
