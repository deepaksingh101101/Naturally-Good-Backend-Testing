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
const typegoose_1 = require("@typegoose/typegoose");
class ProductManagement {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ProductManagement.prototype, "ProductName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], ProductManagement.prototype, "Type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], ProductManagement.prototype, "Group", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], ProductManagement.prototype, "Season", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], ProductManagement.prototype, "Priority", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], ProductManagement.prototype, "Roster", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ProductManagement.prototype, "VeggieNameInHindi", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], ProductManagement.prototype, "UnitQuantity", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], ProductManagement.prototype, "Pieces", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ProductManagement.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ProductManagement.prototype, "CreatedAt", void 0);
const ProductManagementModel = (0, typegoose_1.getModelForClass)(ProductManagement);
exports.default = ProductManagementModel;
