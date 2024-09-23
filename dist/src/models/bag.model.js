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
exports.BagModel = exports.Bag = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const product_model_1 = require("./product.model"); // Adjust the import path accordingly
const employee_model_1 = require("./employee.model");
let Bag = class Bag {
};
exports.Bag = Bag;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Bag.prototype, "BagName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Bag.prototype, "BagMaxWeight", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: ['Admin', 'Public'], default: "Admin", required: true }),
    __metadata("design:type", String)
], Bag.prototype, "BagVisibility", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Bag.prototype, "Status", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Bag.prototype, "BagImageUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Bag.prototype, "BagDescription", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => product_model_1.Product, required: true }),
    __metadata("design:type", Array)
], Bag.prototype, "AllowedItems", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Bag.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Bag.prototype, "UpdatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Bag.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Bag.prototype, "CreatedAt", void 0);
exports.Bag = Bag = __decorate([
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    })
], Bag);
exports.BagModel = (0, typegoose_1.getModelForClass)(Bag); // Ensure named export
