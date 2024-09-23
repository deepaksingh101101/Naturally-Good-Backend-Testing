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
const oldrole_model_1 = require("./oldrole.model");
let Plan = class Plan {
};
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Plan.prototype, "SubscriptionPlan", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Plan.prototype, "PlanDetail", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: true, default: Date.now() }),
    __metadata("design:type", Date)
], Plan.prototype, "CreatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now() }),
    __metadata("design:type", Date)
], Plan.prototype, "UpdatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: true }),
    __metadata("design:type", Boolean)
], Plan.prototype, "Status", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => oldrole_model_1.Admin }),
    __metadata("design:type", Object)
], Plan.prototype, "createdBy", void 0);
Plan = __decorate([
    (0, typegoose_1.pre)('save', function () {
        this.UpdatedAt = new Date();
    })
], Plan);
const PlanModel = (0, typegoose_1.getModelForClass)(Plan);
exports.default = PlanModel;
