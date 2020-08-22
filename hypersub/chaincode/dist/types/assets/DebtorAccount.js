"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebtorAccount = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
let DebtorAccount = class DebtorAccount {
};
DebtorAccount = __decorate([
    fabric_contract_api_1.Object()
], DebtorAccount);
exports.DebtorAccount = DebtorAccount;
//# sourceMappingURL=DebtorAccount.js.map