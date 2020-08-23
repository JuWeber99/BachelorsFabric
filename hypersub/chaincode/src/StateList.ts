import {State} from "./State";
import {Context} from "fabric-contract-api";

export class StateList {
    ctx: Context;
    name: any;
    supportedClasses: {};

    /**
     * Store Fabric context for subsequent API access, and name of list
     */
    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};

    }

    /**
     * Add a state to the list. Creates a new state in worldstate with
     * appropriate composite key.  Note that state defines its own key.
     * State object is serialized before writing.
     */
    async addState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    /**
     * Get a state from the list using supplied keys. Form composite
     * keys to retrieve state from world state. State data is deserialized
     * into JSON object before being returned.
     */
    async getState(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        // @ts-ignore
        if (data && new TextEncoder("utf-8").encode(data.toString())) {
            let state = State.deserialize(data, this.supportedClasses);
            return state;
        } else {
            return null;
        }
    }

    /**
     * Update a state in the list. Puts the new state in world state with
     * appropriate composite key.  Note that state defines its own key.
     * A state is serialized before writing. Logic is very similar to
     * addState() but kept separate becuase it is semantically distinct.
     */
    async updateState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    /** Stores the class for future deserialization */
    use(stateClass) {
        this.supportedClasses[stateClass.getClass()] = stateClass;
    }

}
