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
exports.User = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const employee_model_1 = require("./employee.model");
const dropdown_model_1 = require("./dropdown.model");
const route_model_1 = require("./route.model");
let Address = 
// Address Sub document
class Address {
};
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Address.prototype, "HouseNumber", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Address.prototype, "SocietyLocality", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Address.prototype, "Sector", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => route_model_1.City, required: false }),
    __metadata("design:type", Object)
], Address.prototype, "City", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Address.prototype, "State", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Address.prototype, "ZipCode", void 0);
Address = __decorate([
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.UpdatedAt = new Date();
        });
    })
    // Address Sub document
], Address);
// Family Member Subdocument
class FamilyMember {
}
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], FamilyMember.prototype, "Name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], FamilyMember.prototype, "Height", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], FamilyMember.prototype, "Weight", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date }),
    __metadata("design:type", Date)
], FamilyMember.prototype, "Dob", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], FamilyMember.prototype, "Gender", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], FamilyMember.prototype, "Allergies", void 0);
// Main User Model
class User {
}
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "FirstName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "LastName", void 0);
__decorate([
    (0, typegoose_1.prop)({
        type: Number,
        validate: {
            validator: function (v) {
                return /^(\+91)?[6-9]\d{9}$/.test(v.toString());
            },
            message: 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9'
        }
    }),
    __metadata("design:type", Number)
], User.prototype, "Phone", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Address, required: false }),
    __metadata("design:type", Address)
], User.prototype, "Address", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "Email", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "Profile", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number,
        validate: {
            validator: function (v) {
                return /^(\+91)?[6-9]\d{9}$/.test(v.toString());
            },
            message: 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9'
        }
    }),
    __metadata("design:type", Number)
], User.prototype, "AlternateContactNumber", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "Allergies", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "DOB", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], User.prototype, "Height", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], User.prototype, "Weight", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "Preferences", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "Gender", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: ['2-3', '3-5', 'more than 5'] }),
    __metadata("design:type", String)
], User.prototype, "HowOftenYouCookedAtHome", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "WhatDoYouUsuallyCook", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "AlternateAddress", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [FamilyMember] }),
    __metadata("design:type", Array)
], User.prototype, "FamilyMembers", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "ExtraNotes", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "ReferredCode", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => User, required: false }),
    __metadata("design:type", Object)
], User.prototype, "ReferredBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee, required: false }),
    __metadata("design:type", Object)
], User.prototype, "AssignedEmployee", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => dropdown_model_1.SourceOfCustomer, required: false }),
    __metadata("design:type", Object)
], User.prototype, "Source", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => dropdown_model_1.TypeOfCustomer, required: false }),
    __metadata("design:type", Object)
], User.prototype, "CustomerType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "AccountStatus", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: () => new Date().toISOString() }),
    __metadata("design:type", String)
], User.prototype, "LastLogin", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isUserVerified", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "Otp", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "OtpExpiry", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], User.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], User.prototype, "UpdatedBy", void 0);
// Export UserModel
const UserModel = (0, typegoose_1.getModelForClass)(User);
exports.default = UserModel;
