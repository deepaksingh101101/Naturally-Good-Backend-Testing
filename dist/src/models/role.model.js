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
exports.Role = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const superadmin_model_1 = require("./superadmin.model"); // Adjust the path as needed
let Role = class Role {
};
exports.Role = Role;
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Role.prototype, "roleName", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => superadmin_model_1.SuperAdmin, required: false }),
    __metadata("design:type", Object)
], Role.prototype, "createdBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => superadmin_model_1.SuperAdmin }),
    __metadata("design:type", Object)
], Role.prototype, "updatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({
        type: () => [Object], // Define permissions as an array of objects
        default: [], // Initialize as an empty array
    }),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
exports.Role = Role = __decorate([
    (0, typegoose_1.ModelOptions)({
        schemaOptions: {
            timestamps: true, // Automatically adds createdAt and updatedAt fields
        },
    })
], Role);
const RoleModel = (0, typegoose_1.getModelForClass)(Role);
exports.default = RoleModel;
