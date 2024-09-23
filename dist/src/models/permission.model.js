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
exports.Permission = exports.PermissionItem = void 0;
const typegoose_1 = require("@typegoose/typegoose");
// Define the schema for individual permission items
class PermissionItem {
}
exports.PermissionItem = PermissionItem;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PermissionItem.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false }),
    __metadata("design:type", String)
], PermissionItem.prototype, "href", void 0);
__decorate([
    (0, typegoose_1.prop)({ Type: Boolean, required: false }),
    __metadata("design:type", Boolean)
], PermissionItem.prototype, "isInSidebar", void 0);
let Permission = class Permission {
};
exports.Permission = Permission;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Permission.prototype, "moduleName", void 0);
__decorate([
    (0, typegoose_1.prop)({
        type: () => [PermissionItem],
        required: true,
    }),
    __metadata("design:type", Array)
], Permission.prototype, "permissions", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false }),
    __metadata("design:type", String)
], Permission.prototype, "icon", void 0);
exports.Permission = Permission = __decorate([
    (0, typegoose_1.ModelOptions)({
        schemaOptions: {
            timestamps: true, // This ensures createdAt and updatedAt fields are automatically added
        },
    })
], Permission);
const PermissionModel = (0, typegoose_1.getModelForClass)(Permission);
exports.default = PermissionModel;
