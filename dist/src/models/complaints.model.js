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
exports.Complaints = exports.ResolutionType = exports.StatusType = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const user_model_1 = require("./user.model");
const employee_model_1 = require("./employee.model");
const complaintsType_model_1 = require("./complaintsType.model");
const delivery_model_1 = require("./delivery.model");
var StatusType;
(function (StatusType) {
    StatusType["ACTIVE"] = "active";
    StatusType["INACTIVE"] = "inactive";
})(StatusType || (exports.StatusType = StatusType = {}));
var ResolutionType;
(function (ResolutionType) {
    ResolutionType["ADDONBAG"] = "addonbag";
    ResolutionType["COUPON"] = "coupon";
})(ResolutionType || (exports.ResolutionType = ResolutionType = {}));
class Complaints {
}
exports.Complaints = Complaints;
__decorate([
    (0, typegoose_1.prop)({ ref: () => delivery_model_1.Delivery }),
    __metadata("design:type", Object)
], Complaints.prototype, "DeliveryId", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.User }),
    __metadata("design:type", Object)
], Complaints.prototype, "UserId", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => complaintsType_model_1.ComplaintsType }),
    __metadata("design:type", Object)
], Complaints.prototype, "ComplaintTypeId", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: StatusType, required: true, default: 'active' }),
    __metadata("design:type", String)
], Complaints.prototype, "Status", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: ResolutionType }),
    __metadata("design:type", String)
], Complaints.prototype, "Resolution", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Complaints.prototype, "Description", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Complaints.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Complaints.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Complaints.prototype, "CreatedBy", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => employee_model_1.Employee }),
    __metadata("design:type", Object)
], Complaints.prototype, "UpdatedBy", void 0);
const ComplaintModel = (0, typegoose_1.getModelForClass)(Complaints);
exports.default = ComplaintModel;
