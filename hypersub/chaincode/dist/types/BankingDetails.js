"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SepaDetails = exports.P2PDetails = exports.BankingDetails = exports.PaymentType = void 0;
var PaymentType;
(function (PaymentType) {
    PaymentType["P2P"] = "P2P";
    PaymentType["SEPA_COLLECTION"] = "SEPA";
    PaymentType["CRYPTO"] = "CRYPTO";
})(PaymentType = exports.PaymentType || (exports.PaymentType = {}));
class BankingDetails {
}
exports.BankingDetails = BankingDetails;
class P2PDetails {
}
exports.P2PDetails = P2PDetails;
class SepaDetails {
}
exports.SepaDetails = SepaDetails;
//# sourceMappingURL=BankingDetails.js.map