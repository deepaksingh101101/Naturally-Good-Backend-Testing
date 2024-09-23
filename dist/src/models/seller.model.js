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
exports.Seller = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let Seller = class Seller {
};
exports.Seller = Seller;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Seller.prototype, "SellerName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Seller.prototype, "ShopName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Seller.prototype, "Email", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Seller.prototype, "MobileNo", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Seller.prototype, "Address", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Seller.prototype, "State", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Seller.prototype, "PinCode", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Seller.prototype, "SupplierType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Seller.prototype, "Rating", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Seller.prototype, "BankaccountDetails", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Seller.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Seller.prototype, "CreatedAt", void 0);
exports.Seller = Seller = __decorate([
    (0, typegoose_1.ModelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    })
], Seller);
const SellerModel = (0, typegoose_1.getModelForClass)(Seller);
exports.default = SellerModel;
