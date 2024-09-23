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
exports.RoleTypeModel = exports.FrequencyTypeModel = exports.SubscriptionTypeModel = exports.RosterModel = exports.SeasonModel = exports.ProductTypeModel = exports.TypeOfCustomerModel = exports.SourceOfCustomerModel = exports.TypeOfCustomer = exports.SourceOfCustomer = exports.Role = exports.FrequencyType = exports.SubscriptionType = exports.Season = exports.Roster = exports.ProductType = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const employee_model_1 = require("./employee.model");
let ProductType = class ProductType {
};
exports.ProductType = ProductType;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ProductType.prototype, "Name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], ProductType.prototype, "SortOrder", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ProductType.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ProductType.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], ProductType.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], ProductType.prototype, "UpdatedBy", void 0);
exports.ProductType = ProductType = __decorate([
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    }),
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    }),
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    }),
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    }),
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    }),
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    }),
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    })
    // Define the ProductType schema
], ProductType);
// Define the Roster schema
class Roster {
}
exports.Roster = Roster;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Roster.prototype, "Name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Roster.prototype, "SortOrder", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], Roster.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], Roster.prototype, "UpdatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Roster.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Roster.prototype, "UpdatedAt", void 0);
// Define the Season schema
class Season {
}
exports.Season = Season;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Season.prototype, "Name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Season.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], Season.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], Season.prototype, "UpdatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Season.prototype, "UpdatedAt", void 0);
// Define the Subscription Type schema
class SubscriptionType {
}
exports.SubscriptionType = SubscriptionType;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SubscriptionType.prototype, "Name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], SubscriptionType.prototype, "Value", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], SubscriptionType.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], SubscriptionType.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], SubscriptionType.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], SubscriptionType.prototype, "UpdatedBy", void 0);
// Define the Frequency Type schema
class FrequencyType {
}
exports.FrequencyType = FrequencyType;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], FrequencyType.prototype, "Name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], FrequencyType.prototype, "Value", void 0);
__decorate([
    (0, typegoose_1.prop)({ Type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], FrequencyType.prototype, "DayBasis", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], FrequencyType.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], FrequencyType.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], FrequencyType.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], FrequencyType.prototype, "UpdatedBy", void 0);
// Define the Frequency Type schema
class Role {
}
exports.Role = Role;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Role.prototype, "Name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Role.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Role.prototype, "UpdatedAt", void 0);
class SourceOfCustomer {
}
exports.SourceOfCustomer = SourceOfCustomer;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SourceOfCustomer.prototype, "Name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], SourceOfCustomer.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], SourceOfCustomer.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], SourceOfCustomer.prototype, "UpdatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], SourceOfCustomer.prototype, "UpdatedAt", void 0);
class TypeOfCustomer {
}
exports.TypeOfCustomer = TypeOfCustomer;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], TypeOfCustomer.prototype, "Name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], TypeOfCustomer.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], TypeOfCustomer.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], TypeOfCustomer.prototype, "UpdatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], TypeOfCustomer.prototype, "UpdatedAt", void 0);
// Create models for each schema
const ProductTypeModel = (0, typegoose_1.getModelForClass)(ProductType);
exports.ProductTypeModel = ProductTypeModel;
const SeasonModel = (0, typegoose_1.getModelForClass)(Season);
exports.SeasonModel = SeasonModel;
const RosterModel = (0, typegoose_1.getModelForClass)(Roster);
exports.RosterModel = RosterModel;
const SubscriptionTypeModel = (0, typegoose_1.getModelForClass)(SubscriptionType);
exports.SubscriptionTypeModel = SubscriptionTypeModel;
const FrequencyTypeModel = (0, typegoose_1.getModelForClass)(FrequencyType);
exports.FrequencyTypeModel = FrequencyTypeModel;
const RoleTypeModel = (0, typegoose_1.getModelForClass)(Role);
exports.RoleTypeModel = RoleTypeModel;
const SourceOfCustomerModel = (0, typegoose_1.getModelForClass)(SourceOfCustomer);
exports.SourceOfCustomerModel = SourceOfCustomerModel;
const TypeOfCustomerModel = (0, typegoose_1.getModelForClass)(TypeOfCustomer);
exports.TypeOfCustomerModel = TypeOfCustomerModel;
