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
exports.Coupon = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const employee_model_1 = require("./employee.model");
const subscription_model_1 = require("./subscription.model");
const user_model_1 = require("./user.model");
class AssignedToSchema {
}
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.User, required: true }) // Ensure that ref is specified correctly
    ,
    __metadata("design:type", Object)
], AssignedToSchema.prototype, "Users", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Boolean)
], AssignedToSchema.prototype, "isUsed", void 0);
let Coupon = class Coupon {
};
exports.Coupon = Coupon;
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: ['Normal', 'Subscription', 'Referred'], required: true }),
    __metadata("design:type", String)
], Coupon.prototype, "CouponType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: ['Normal', 'FreeDelivery', 'CelebrityType', 'SeasonSpecial', 'Referred'], required: true }),
    __metadata("design:type", String)
], Coupon.prototype, "CouponCategory", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Coupon.prototype, "Code", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: ['Percentage', 'FixedAmount'], required: false }),
    __metadata("design:type", String)
], Coupon.prototype, "DiscountType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: ['Active', 'Inactive'], required: true, default: "Active" }),
    __metadata("design:type", String)
], Coupon.prototype, "Status", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Coupon.prototype, "DiscountPercentage", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Coupon.prototype, "DiscountPrice", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: ['DateRange', 'NoRange'], required: true }),
    __metadata("design:type", String)
], Coupon.prototype, "ValidityType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date }),
    __metadata("design:type", Date)
], Coupon.prototype, "StartDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date }),
    __metadata("design:type", Date)
], Coupon.prototype, "EndDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, default: 1 }),
    __metadata("design:type", Number)
], Coupon.prototype, "NumberOfTimesCanBeAppliedPerUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: ['Admin', 'Public', 'Private'], required: true, default: "Private" }),
    __metadata("design:type", String)
], Coupon.prototype, "CouponVisibility", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Coupon.prototype, "Description", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Coupon.prototype, "ImageUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "ReferredTo", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "ReferredBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Coupon.prototype, "RevenueGenerated", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Coupon.prototype, "NumberOfTimesUsed", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Coupon.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Coupon.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Coupon.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Coupon.prototype, "UpdatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => subscription_model_1.Subscription, required: false }),
    __metadata("design:type", Array)
], Coupon.prototype, "Subscriptions", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [AssignedToSchema] }) // Array of subdocuments
    ,
    __metadata("design:type", Array)
], Coupon.prototype, "AssignedTo", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.User, required: false }),
    __metadata("design:type", Array)
], Coupon.prototype, "UsedBy", void 0);
exports.Coupon = Coupon = __decorate([
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    })
], Coupon);
// Export CouponModel
const CouponModel = (0, typegoose_1.getModelForClass)(Coupon);
exports.default = CouponModel;
