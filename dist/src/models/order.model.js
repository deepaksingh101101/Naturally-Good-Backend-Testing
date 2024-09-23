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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.AllPaymentStatus = exports.AllPaymentType = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const employee_model_1 = require("./employee.model");
const user_model_1 = require("./user.model");
const subscription_model_1 = require("./subscription.model");
const coupons_model_1 = require("./coupons.model");
const delivery_model_1 = require("./delivery.model");
var AllPaymentType;
(function (AllPaymentType) {
    AllPaymentType["Cash"] = "cash";
    AllPaymentType["Card"] = "card";
    AllPaymentType["Upi"] = "upi";
    AllPaymentType["NetBanking"] = "netbanking";
})(AllPaymentType || (exports.AllPaymentType = AllPaymentType = {}));
var AllPaymentStatus;
(function (AllPaymentStatus) {
    AllPaymentStatus["Paid"] = "paid";
    AllPaymentStatus["Pending"] = "pending";
    AllPaymentStatus["Unpaid"] = "unpaid";
})(AllPaymentStatus || (exports.AllPaymentStatus = AllPaymentStatus = {}));
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.User, required: true }),
    __metadata("design:type", Object)
], Order.prototype, "UserId", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => subscription_model_1.Subscription, required: true }),
    __metadata("design:type", Object)
], Order.prototype, "SubscriptionId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Order.prototype, "NetPrice", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => coupons_model_1.Coupon }),
    __metadata("design:type", Object)
], Order.prototype, "Coupons", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "ManualDiscountPercentage", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "AmountReceived", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "AmountDue", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Order.prototype, "BookingDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Order.prototype, "DeliveryStartDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date }),
    __metadata("design:type", Date)
], Order.prototype, "PaymentDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: AllPaymentStatus, required: true }),
    __metadata("design:type", String)
], Order.prototype, "PaymentStatus", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: AllPaymentType, required: true }),
    __metadata("design:type", String)
], Order.prototype, "PaymentType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "SpecialInstruction", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "isCurrentOrder", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Order.prototype, "Status", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => delivery_model_1.Delivery }),
    __metadata("design:type", Array)
], Order.prototype, "Deliveries", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Order.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Order.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Order.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Order.prototype, "UpdatedBy", void 0);
exports.Order = Order = __decorate([
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    })
], Order);
const OrderModel = (0, typegoose_1.getModelForClass)(Order);
exports.default = OrderModel;
