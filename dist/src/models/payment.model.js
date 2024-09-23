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
exports.PaymentStatus = exports.PaymentMethod = void 0;
const typegoose_1 = require("@typegoose/typegoose");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CreditCard"] = "Credit Card";
    PaymentMethod["PayPal"] = "PayPal";
    PaymentMethod["BankTransfer"] = "Bank Transfer";
    PaymentMethod["Cash"] = "Cash";
    PaymentMethod["Other"] = "Other";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["InProgress"] = "inprogress";
    PaymentStatus["Approved"] = "approved";
    PaymentStatus["Reject"] = "reject";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
class Payment {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Payment.prototype, "UserId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Payment.prototype, "SubscriptionId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date }),
    __metadata("design:type", Date)
], Payment.prototype, "PaymentDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Payment.prototype, "PaymentAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: PaymentMethod, required: true }),
    __metadata("design:type", String)
], Payment.prototype, "PaymentMethod", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: PaymentStatus, required: false }),
    __metadata("design:type", String)
], Payment.prototype, "PaymentStatus", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Payment.prototype, "PaymentConfirmation", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Payment.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Payment.prototype, "UpdatedAt", void 0);
const PaymentModel = (0, typegoose_1.getModelForClass)(Payment);
exports.default = PaymentModel;
