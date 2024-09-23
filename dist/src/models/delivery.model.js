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
exports.Delivery = exports.DeliveryStatus = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const bag_model_1 = require("./bag.model");
const product_model_1 = require("./product.model");
const route_model_1 = require("./route.model");
const employee_model_1 = require("./employee.model");
const user_model_1 = require("./user.model");
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["Pending"] = "pending";
    DeliveryStatus["Delivered"] = "delivered";
    DeliveryStatus["Skipped"] = "skipped";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
class BagDetails {
}
__decorate([
    (0, typegoose_1.prop)({ ref: () => bag_model_1.Bag, required: true }),
    __metadata("design:type", Object)
], BagDetails.prototype, "BagID", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], BagDetails.prototype, "BagWeight", void 0);
class AddonDetails {
}
__decorate([
    (0, typegoose_1.prop)({ ref: () => product_model_1.Product, required: true }),
    __metadata("design:type", Object)
], AddonDetails.prototype, "ProductId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], AddonDetails.prototype, "RequiredUnits", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], AddonDetails.prototype, "TotalPrice", void 0);
let Delivery = class Delivery {
};
exports.Delivery = Delivery;
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.User, required: true }),
    __metadata("design:type", Object)
], Delivery.prototype, "UserId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Delivery.prototype, "DeliveryDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Delivery.prototype, "DeliveryTime", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: DeliveryStatus, required: true, default: DeliveryStatus.Pending }),
    __metadata("design:type", String)
], Delivery.prototype, "Status", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => route_model_1.Route, required: false }),
    __metadata("design:type", Object)
], Delivery.prototype, "AssignedRoute", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [BagDetails], required: true }),
    __metadata("design:type", Array)
], Delivery.prototype, "Bag", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [AddonDetails], required: true }),
    __metadata("design:type", Array)
], Delivery.prototype, "Addons", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Delivery.prototype, "Note", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Delivery.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Delivery.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Delivery.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Delivery.prototype, "UpdatedBy", void 0);
exports.Delivery = Delivery = __decorate([
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    })
], Delivery);
const DeliveryModel = (0, typegoose_1.getModelForClass)(Delivery);
exports.default = DeliveryModel;
