"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAccountContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const initialTestLedger_1 = require("./testing/initialTestLedger");
const util_1 = require("./util");
const CustomerAccountAsset_1 = require("./types/assets/CustomerAccountAsset");
let CustomerAccountContract = class CustomerAccountContract extends fabric_contract_api_1.Contract {
    async InitLedger(ctx) {
        for (const customerAccount of initialTestLedger_1.testAccounts) {
            await ctx.stub.putState(customerAccount.accountId, Buffer.from(JSON.stringify(customerAccount)));
            console.info(`Account ${customerAccount.accountId} initialized`);
        }
    }
    async CreateCustomerAccount(ctx, customerAccount) {
        await ctx.stub.putState(customerAccount.accountId, util_1.JsonUtil.createBufferFromJSON(customerAccount));
    }
    ;
    async ReadCustomerAccount(ctx, id, customerAccount) {
        let jsonRepresentation;
        if (id == null && customerAccount == null) {
            throw new Error("no Parameter given");
        }
        else if (id == null) {
            jsonRepresentation = ctx.stub.getState(id);
        }
        else if (customerAccount == null) {
            jsonRepresentation = ctx.stub.getState(customerAccount.accountId);
        }
        if (!jsonRepresentation || jsonRepresentation.length === 0) {
            throw new Error("asset not found");
        }
        return jsonRepresentation.toString();
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], CustomerAccountContract.prototype, "InitLedger", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, CustomerAccountAsset_1.CustomerAccount]),
    __metadata("design:returntype", Promise)
], CustomerAccountContract.prototype, "CreateCustomerAccount", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns("string"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, CustomerAccountAsset_1.CustomerAccount]),
    __metadata("design:returntype", Promise)
], CustomerAccountContract.prototype, "ReadCustomerAccount", null);
CustomerAccountContract = __decorate([
    fabric_contract_api_1.Info({ title: "CustomerAccountContract", description: "Smart contract for managing customer accounts" })
], CustomerAccountContract);
exports.CustomerAccountContract = CustomerAccountContract;
//# sourceMappingURL=CustomerAccountContract.js.map