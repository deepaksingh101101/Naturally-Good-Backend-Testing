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
exports.Product = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const employee_model_1 = require("./employee.model");
const dropdown_model_1 = require("./dropdown.model");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Product.prototype, "ProductName", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => dropdown_model_1.ProductType, required: true }),
    __metadata("design:type", Object)
], Product.prototype, "Type", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => dropdown_model_1.Season, required: true }),
    __metadata("design:type", Object)
], Product.prototype, "Season", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Product.prototype, "Priority", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => dropdown_model_1.Roster }),
    __metadata("design:type", Object)
], Product.prototype, "Roster", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Product.prototype, "Group", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Product.prototype, "VeggieNameInHindi", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Product.prototype, "UnitQuantity", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Product.prototype, "Price", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Product.prototype, "MinimumUnits", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Product.prototype, "MaximumUnits", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Product.prototype, "ImageURL", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Product.prototype, "Description", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Product.prototype, "Notes", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Product.prototype, "Buffer", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: false, default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "Available", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: ['Admin', 'Public'], required: true, default: 'Admin' }),
    __metadata("design:type", String)
], Product.prototype, "Visibility", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Product.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Product.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Product.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Product.prototype, "UpdatedBy", void 0);
exports.Product = Product = __decorate([
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    })
], Product);
const ProductModel = (0, typegoose_1.getModelForClass)(Product);
exports.default = ProductModel;
