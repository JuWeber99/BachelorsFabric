"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataUsageEvent = exports.SmsEvent = exports.CallEvent = exports.EventStructure = exports.PricedEventType = void 0;
var PricedEventType;
(function (PricedEventType) {
    PricedEventType["CALL"] = "call";
    PricedEventType["DATA_USAGE"] = "data_usage";
    PricedEventType["SMS"] = "sms";
})(PricedEventType = exports.PricedEventType || (exports.PricedEventType = {}));
class EventStructure {
}
exports.EventStructure = EventStructure;
class CallEvent extends EventStructure {
}
exports.CallEvent = CallEvent;
class SmsEvent extends EventStructure {
}
exports.SmsEvent = SmsEvent;
class DataUsageEvent extends EventStructure {
}
exports.DataUsageEvent = DataUsageEvent;
//# sourceMappingURL=PricedEvent.js.map